import { readFileSync } from "fs"
import path from "path"
import {
  Application,
  Comment,
  CommentTag,
  Context,
  Converter,
  DeclarationReflection,
  ParameterType,
  ReflectionKind,
} from "typedoc"
import { MedusaEvent } from "types"
import { getDirname } from "utils"

export class EventsResolver {
  private app: Application
  private events: MedusaEvent[] = []

  constructor(app: Application) {
    this.app = app

    this.app.options.addDeclaration({
      name: "enableEventsResolver",
      help: "Whether to resolve events.",
      type: ParameterType.Boolean,
      defaultValue: false,
    })

    this.app.converter.on(
      Converter.EVENT_RESOLVE_BEGIN,
      this.resolveEvents.bind(this)
    )
  }

  resolveEvents(context: Context) {
    if (!this.app.options.getValue("enableEventsResolver")) {
      return
    }

    if (!this.events.length) {
      const __dirname = getDirname(import.meta.url)

      const jsonFilePath = path.resolve(
        __dirname,
        path.join("..", "..", "..", "generated", "events-output.json")
      )
      // read events file
      const eventsJSON = readFileSync(jsonFilePath, "utf-8")
      this.events = JSON.parse(eventsJSON)
    }

    for (const reflection of context.project.getReflectionsByKind(
      ReflectionKind.Variable
    )) {
      if (
        !(reflection instanceof DeclarationReflection) ||
        reflection.type?.type !== "reflection" ||
        !reflection.type.declaration.children
      ) {
        continue
      }

      const relatedEvents = this.events.filter(
        (event) => event.parentName === reflection.name
      )

      if (!relatedEvents.length) {
        continue
      }

      // loop over variable properties
      for (const property of reflection.type.declaration.children) {
        const propertyEvent = relatedEvents.find(
          (event) => event.propertyName === property.name
        )

        if (!propertyEvent) {
          continue
        }

        if (!property.comment) {
          property.comment = new Comment()
        }

        property.comment.blockTags.push(
          new CommentTag("@eventName", [
            {
              kind: "code",
              text: propertyEvent.name,
            },
          ])
        )

        property.comment.blockTags.push(
          new CommentTag("@workflows", [
            {
              kind: "text",
              text: propertyEvent.workflows.join(", "),
            },
          ])
        )
      }
    }
  }
}
