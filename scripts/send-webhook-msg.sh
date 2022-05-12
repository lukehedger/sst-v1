#!/bin/sh

# Usage: sh scripts/send-webhook-msg.sh <message>

webhookEndpoint=$(cat .outputs/cdk.json | jq '.[].webhookApiUrl' --raw-output)

message=$1

curl -i -X POST $webhookEndpoint -H 'Content-Type: application/json' -d '{"message": "$message"}'
