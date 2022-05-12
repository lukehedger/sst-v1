import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import { APIGatewayEvent } from "aws-lambda";

interface MessageReceivedEvent {
  message: string;
  receivedAt: number;
}

interface WebhookMessageBody {
  message: string;
}

interface WebhookRequestResult {
  statusCode: number;
}

export const eventBridgeClient = new EventBridgeClient({
  region: process.env.AWS_REGION,
});

export const handler = async (
  event: APIGatewayEvent
): Promise<WebhookRequestResult> => {
  if (!event.body) {
    return {
      statusCode: 400,
    };
  }

  let eventBody: WebhookMessageBody;

  try {
    eventBody = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 500,
    };
  }

  try {
    const putMessageReceivedEventCommand = new PutEventsCommand({
      Entries: [
        {
          Detail: JSON.stringify({
            message: eventBody.message,
            receivedAt: Date.now(),
          } as MessageReceivedEvent),
          DetailType: "MessageReceived",
          EventBusName: process.env.EVENT_BUS_NAME,
          Source: `app.webhook.${process.env.AWS_LAMBDA_FUNCTION_NAME}`,
        },
      ],
    });

    await eventBridgeClient.send(putMessageReceivedEventCommand);

    return {
      statusCode: 200,
    };
  } catch (error) {
    return {
      statusCode: 500,
    };
  }
};
