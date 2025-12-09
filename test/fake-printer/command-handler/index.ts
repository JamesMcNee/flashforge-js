export interface CommandHandler {
  handles: (command: string) => boolean
  handle: (command: string) => string[]
}
