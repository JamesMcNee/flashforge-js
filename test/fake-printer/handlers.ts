import { CommandHandler } from "test/fake-printer/command-handler"
import { ControlMessage } from "test/fake-printer/command-handler/control-message"
import { DefaultCommandHandler } from "test/fake-printer/command-handler/default"
import { InfoCommandHandler } from "test/fake-printer/command-handler/info"

export const handlers = [
  new ControlMessage(),
  new InfoCommandHandler(),
] satisfies CommandHandler[]

export function findHandlerForCommand(command: string): CommandHandler {
  for (const handler of handlers) {
    if (handler.handles(command)) {
      return handler
    }
  }

  return new DefaultCommandHandler()
}
