#!/bin/sh

# Usage: sh scripts/tail-event-logs.sh <profile>

logGroupName=$(cat .outputs/cdk.json | jq '.[].webhookEventsLogGroupName' --raw-output)

profile=$1

aws logs tail $logGroupName --follow --profile=$profile
