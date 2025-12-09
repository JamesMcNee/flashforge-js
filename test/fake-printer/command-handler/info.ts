import { CommandHandler } from "test/fake-printer/command-handler/index"

export class InfoCommandHandler implements CommandHandler {
  public handles(command: string): boolean {
    return command === "~M115"
  }

  public handle(): string[] {
    return [
      "CMD M115 Received.",
      "Machine Type: Flashforge Adventurer 5M Pro",
      "Machine Name: SNMOME2874567",
      "Firmware: v3.2.4",
      "SN: SNMOME2874567",
      "X: 220 Y: 220 Z: 220",
      "Tool Count: 1",
      "Mac Address:11:22:33:44:55:66",
      "ok",
    ]
  }
}
