import net from "node:net"
import { findHandlerForCommand, handlers } from "test/fake-printer/handlers"

type FakePrinterOptions = {
  /**
   * Port to run the fake printer on. Defaults to 8899.
   */
  port?: number
}

export class FakePrinter {
  private static readonly DEFAULT_PORT: number = 8899

  private readonly server: net.Server

  constructor() {
    this.server = net.createServer((socket) => {
      socket.on("data", (data) => {
        const command = data.toString()

        const matchingHandler = findHandlerForCommand(command)

        const response = matchingHandler.handle(command).join("\r\n") + "\r\n"

        socket.write(response)
      })
    })
  }

  public async start(options: FakePrinterOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.listen(options?.port ?? FakePrinter.DEFAULT_PORT, () => {
        resolve()
      })

      this.server.on("error", (err) => {
        reject(err)
      })
    })
  }

  public async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.close((err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}
