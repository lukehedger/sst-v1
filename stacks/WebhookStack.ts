import { StackContext, Api } from "@serverless-stack/resources";

export function WebhookStack({ stack }: StackContext) {
  const webhookApi = new Api(stack, "WebhookApi", {
    routes: {
      "GET /": "lambda.handler",
    },
  });

  stack.addOutputs({
    webhookApiUrl: webhookApi.url,
  });

  // TODO: Put Event from AWS Lambda - sdk v3

  // TODO: EventBridge bus event stream - CW log group target (optional via stack props) and tail logs (use Cfn outputs to get group ID, write node script to grab ID and run AWS CLI command)

  // TODO: Lambda to DynamoDB

  // TODO: Stack tests
}
