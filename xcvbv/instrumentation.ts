// Uncomment this file to enable instrumentation and observability using OpenTelemetry
// Refer to the docs for installation instructions: https://docs.acmekitjs.com/learn/debugging-and-testing/instrumentation

// import { registerOtel } from "@acmekit/acmekit"
// // If using an exporter other than Zipkin, require it here.
// import { ZipkinExporter } from "@opentelemetry/exporter-zipkin"

// // If using an exporter other than Zipkin, initialize it here.
// const exporter = new ZipkinExporter({
//   serviceName: 'my-acmekit-project',
// })

// export function register() {
//   registerOtel({
//     serviceName: 'acmekitjs',
//     // pass exporter
//     exporter,
//     instrument: {
//       http: true,
//       workflows: true,
//       query: true
//     },
//   })
// }