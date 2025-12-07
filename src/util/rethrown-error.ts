export class RethrownError extends Error {
  constructor(
    message: string,
    public readonly originalError: Error,
  ) {
    super(message)
    this.name = "RethrownError"
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, RethrownError.prototype)
  }
}
