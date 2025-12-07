import { Socket } from "node:net"
import {
  Printer,
  PrinterInfo,
  PrinterProgress,
} from "src/modules/printer/service/model/printer"
import { PrinterResponseParser } from "src/modules/printer/repository/parser"
import { z } from "zod"
import { ZodPrinterResponseParser } from "src/modules/printer/repository/parser/zod"
import { RethrownError } from "src/util/rethrown-error"

type PrinterCommand = `~M${number}` | `~M${number} ${string}`

type PrinterConstructorOptions =
  | {
      ip: string
    }
  | {
      host: string
    }

const controlMessage: PrinterCommand = "~M601 S1"

export class DefaultPrinter implements Printer {
  private static readonly API_PORT = 8899

  public readonly id: string

  private readonly ipOrHost: string

  constructor(config: PrinterConstructorOptions) {
    this.ipOrHost = "ip" in config ? config.ip : config.host
    this.id = this.ipOrHost
  }

  public async getInfo(): Promise<PrinterInfo> {
    const rawInfoSchema = z.object({
      "Machine Name": z.string().describe("Name of the printer"),
      "Machine Type": z.string().describe("Model of the printer"),
      Firmware: z.string().describe("Firmware version of the printer"),
      SN: z.string().describe("Serial number of the printer"),
      "Mac Address": z.string().describe("MAC address of the printer"),
      X: z.coerce.number().describe("Current X position of the printer head"),
      Y: z.coerce.number().describe("Current Y position of the printer head"),
      Z: z.coerce.number().describe("Current Z position of the printer head"),
      "Tool Count": z.string().describe("Number of tools on the printer"),
    })

    const response = await this.request({
      command: "~M115",
      parser: new ZodPrinterResponseParser(rawInfoSchema),
    })

    return {
      name: response["Machine Name"],
      model: response["Machine Type"],
      firmwareVersion: response.Firmware,
      serialNumber: response.SN,
      macAddress: response["Mac Address"],
      position: {
        x: response.X,
        y: response.Y,
        z: response.Z,
      },
    }
  }

  public async getProgress(): Promise<PrinterProgress> {
    return this.request({
      command: "~M27 C",
      parser: {
        parse: (data: string) => {
          const lines = data.split("\n")
          const [progressLhs, progressRhs] = lines[0]
            .replace("SD printing byte", "")
            .trim()
            .split("/")
            .map((part) => part.trim())
            .map((x) => parseInt(x, 10))
          const [layerLhs, layerRhs] = lines[1]
            .replace("Layer:", "")
            .trim()
            .split("/")
            .flatMap((part) => part.trim())
            .map((x) => parseInt(x, 10))

          return {
            bytes: {
              completedBytes: progressLhs,
              totalBytes: progressRhs,
              percentage:
                progressRhs === 0
                  ? 0
                  : Math.round((progressLhs / progressRhs) * 10000) / 100,
            },
            layer: {
              currentLayer: layerLhs,
              totalLayers: layerRhs,
              percentage:
                layerRhs === 0
                  ? 0
                  : Math.round((layerLhs / layerRhs) * 10000) / 100,
            },
          }
        },
      },
    })
  }

  private async request<T>(args: {
    command: PrinterCommand
    parser: PrinterResponseParser<T>
  }): Promise<T> {
    const socket = new Socket()
    socket.setTimeout(3_000)

    socket.on("timeout", () => {
      socket.destroy(new Error("Connection timed out"))
    })

    return new Promise<T>((resolve, reject) => {
      socket.connect(DefaultPrinter.API_PORT, this.ipOrHost, () => {
        socket.write(`${controlMessage}\r\n`)
        socket.write(`${args.command}\r\n`)
      })

      let seenFirstOk = false
      let dataBuffer = ""
      socket.on("data", (data) => {
        console.log("Received data chunk:\n", data.toString())
        if (!seenFirstOk) {
          const dataStr = data.toString()
          if (dataStr.includes("ok")) {
            seenFirstOk = true
          }

          // Ignore any data before the first "ok"
          return
        }

        dataBuffer += data.toString()

        if (dataBuffer.endsWith("\n")) {
          try {
            const withoutHeader = dataBuffer.split("\n").slice(1, -2).join("\n")

            const parsedData = args.parser.parse(withoutHeader)
            resolve(parsedData)
          } catch (error) {
            reject(
              new RethrownError("Failed to parse response", error as Error),
            )
          } finally {
            socket.end()
          }
        }
      })

      socket.on("error", (err) => {
        reject(err)
      })

      socket.on("close", () => {
        // Connection closed
      })
    })
  }
}
