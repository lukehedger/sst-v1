import { PutEventsCommandOutput } from "@aws-sdk/client-eventbridge";
import { APIGatewayEvent } from "aws-lambda";
import { describe, expect, it, vi } from "vitest";
import { eventBridgeClient, handler } from "../ingest-webhook";

describe("ingest webhook", () => {
  it("should reject request without body", async () => {
    const result = await handler({} as APIGatewayEvent);

    expect(result.statusCode).toBe(400);
  });

  it("should reject request with invalid body", async () => {
    const result = await handler({ body: "Hello, World" } as APIGatewayEvent);

    expect(result.statusCode).toBe(500);
  });

  it("should reject request with invalid body", async () => {
    const result = await handler({
      body: JSON.stringify({ message: "Hello, World" }),
    } as APIGatewayEvent);

    expect(result.statusCode).toBe(500);
  });

  it("should process webhook message", async () => {
    const spy = vi.spyOn(eventBridgeClient, "send").mockImplementation(
      (): PutEventsCommandOutput => ({
        $metadata: {},
        Entries: [{ EventId: "1234-5678-9012-3456" }],
      })
    );

    const result = await handler({
      body: JSON.stringify({ message: "Hello, World" }),
    } as APIGatewayEvent);

    expect(spy).toHaveBeenCalled();

    expect(result.statusCode).toBe(200);
  });
});
