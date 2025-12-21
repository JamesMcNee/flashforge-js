import {
  FlashforgePrinter,
  PrinterConstructorOptions,
} from "src/printer/flashforgePrinter"

type KnownModel = "Adventurer 5M"

export class PrinterFactory {
  public static async create(
    model: KnownModel,
    options: PrinterConstructorOptions,
  ): Promise<FlashforgePrinter> {
    switch (model) {
      case "Adventurer 5M": {
        const { Adventurer5M } = await import("src/printer/impls/ad5m/printer")

        return new Adventurer5M(options)
      }
      default:
        throw new Error(`Unsupported printer model: ${model}`)
    }
  }
}
