import { CommandHandler } from "test/fake-printer/command-handler/index"

export class DefaultCommandHandler implements CommandHandler {
  public handles(): boolean {
    return true
  }

  public handle(command: string): string[] {
    return [`CMD ${command.trim()} Received.`, "ok"]
  }
}
