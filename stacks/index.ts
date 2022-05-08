import { WebhookStack } from "./WebhookStack";
import { App } from "@serverless-stack/resources";

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs14.x",
    srcPath: "functions",
    bundle: {
      format: "esm",
    },
  });

  app.stack(WebhookStack);
}
