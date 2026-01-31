import { FormattingOptionsType } from "types"

const eventsOptions: FormattingOptionsType = {
  "^modules/events/": {
    reflectionDescription: `This documentation page includes the list of all events emitted by [AcmeKit's workflows](https://docs.acmekit.com/resources/acmekit-workflows-reference).`,
    frontmatterData: {
      slug: "/references/events",
      sidebar_label: "Events Reference",
      generate_toc: true,
    },
    isEventsReference: true,
    reflectionTitle: {
      fullReplacement: "Events Reference",
    },
  },
  "^module_events": {
    expandMembers: true,
    isEventsReference: true,
    reflectionDescription: `This reference shows all the events emitted by the AcmeKit application related to the {{alias}} Module. If you use the module outside the AcmeKit application, these events aren't emitted.`,
    reflectionTitle: {
      suffix: "Module Events Reference",
    },
    frontmatterData: {
      slug: "/references/{{alias-slug}}/events",
      sidebar_label: "Events Reference",
      generate_toc: true,
    },
  },
}

export default eventsOptions
