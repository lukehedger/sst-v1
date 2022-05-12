import { WebhookStack } from "./WebhookStack";
import { App } from "@serverless-stack/resources";

export default function (app: App) {
  app.setDefaultFunctionProps({
    bundle: {
      format: "esm",
    },
    runtime: "nodejs14.x",
    srcPath: "functions",
  });

  app.stack(WebhookStack);
}
