import { PrinterResponseParser } from "src/modules/printer/repository/parser/index"
import { ZodObject } from "zod"

export class ZodPrinterResponseParser<
  T extends ZodObject,
> implements PrinterResponseParser<ReturnType<T["parse"]>> {
  constructor(private readonly schema: T) {}

  public parse(data: string): ReturnType<T["parse"]> {
    const kv = this.parseKeyValueResponse(data)

    return this.schema.parse(kv) as ReturnType<T["parse"]>
  }

  private parseKeyValueResponse(data: string): object {
    const result: Record<string, string> = {}

    const lines = data.split("\n")

    for (const line of lines) {
      // Special dispensation for the line with X, Y, Z which has the format "X: 220 Y: 220 Z: 220"
      if (line.includes("X:") && line.includes("Y:") && line.includes("Z:")) {
        const match = line.match(
          /X:\s*([-+]?[0-9]*\.?[0-9]+)\s*Y:\s*([-+]?[0-9]*\.?[0-9]+)\s*Z:\s*([-+]?[0-9]*\.?[0-9]+)/,
        )
        if (match) {
          result["X"] = match[1]
          result["Y"] = match[2]
          result["Z"] = match[3]
        }
        continue
      }

      const [key, ...value] = line.split(":").map((part) => part.trim())
      if (key && value) {
        result[key] = value.join(":").trim()
      }
    }

    return result
  }
}
