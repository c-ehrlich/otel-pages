// Importing necessary OpenTelemetry modules
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

// Initialize OTLP trace exporter with Axiom endpoint and headers for authorization and dataset specification
const traceExporter = new OTLPTraceExporter({
  url: "https://api.axiom.co/v1/traces",
  headers: {
    Authorization: "Bearer $API_TOKEN",
    "X-Axiom-Dataset": "$DATASET_NAME",
  },
});

// Configure the Node SDK with a resource for the service name, a batch span processor, and auto-instrumentations
const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "your-service-name", // Replace with your actual service name
  }),
  spanProcessor: new BatchSpanProcessor(traceExporter),
  instrumentations: [getNodeAutoInstrumentations()],
});

// Start the OpenTelemetry SDK with error handling
try {
  sdk.start();
  console.log("OpenTelemetry SDK started successfully.");
} catch (error) {
  console.error("Error starting OpenTelemetry SDK:", error);
}
