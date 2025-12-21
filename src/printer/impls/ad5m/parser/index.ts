export interface PrinterResponseParser<R> {
  parse(data: string): R
}
