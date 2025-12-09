import { CommandHandler } from "test/fake-printer/command-handler/index"

export class ControlMessage implements CommandHandler {
  public handles(command: string): boolean {
    return command === "~M601 S1"
  }

  public handle(): string[] {
    return ["CMD M601 Received.", "Control Success V2.1.", "ok"]
  }
}
