import {
  Api,
  EventBus,
  EventBusRuleProps,
  StackContext,
} from "@serverless-stack/resources";
import { RemovalPolicy } from "aws-cdk-lib";
import { Rule } from "aws-cdk-lib/aws-events";
import { CloudWatchLogGroup } from "aws-cdk-lib/aws-events-targets";
import { LogGroup } from "aws-cdk-lib/aws-logs";

export function WebhookStack({ stack }: StackContext) {
  const logGroup = new LogGroup(this, "WebhookLogGroup", {
    logGroupName: "/app/webhook/events",
    removalPolicy: RemovalPolicy.DESTROY,
  });

  const webhookBus = new EventBus(stack, "WebhookBus");

  new Rule(this, "WebhookBusLogGroupRule", {
    eventBus: webhookBus.cdk.eventBus,
    eventPattern: {
      detailType: ["MessageReceived"],
    },
    ruleName: "WebhookBusLogGroupRule",
    targets: [new CloudWatchLogGroup(logGroup)],
  });

  const webhookApi = new Api(stack, "WebhookApi", {
    routes: {
      "POST /": {
        function: {
          handler: "ingest-webhook.handler",
          functionName: "ingest-webhook",
          environment: { EVENT_BUS_NAME: webhookBus.eventBusName },
        },
      },
    },
  });

  stack.addOutputs({
    webhookApiUrl: webhookApi.url,
    webhookEventsLogGroupName: logGroup.logGroupName,
  });
}
