
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.TABLE_NAME;

const VALID_COLORS = ["black", "blue", "green", "yellow", "red", "purple"];

export const handler = async (event) => {
  try {
    const id = event.pathParameters?.id;
    const body = JSON.parse(event.body || "{}");

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing id" })
      };
    }

    const updateParts = [];
    const expressionValues = {};
    const expressionNames = {};

    //updatedAt
    expressionNames["#updatedAt"] = "updatedAt";
    expressionValues[":updatedAt"] = { S: new Date().toISOString() };
    updateParts.push("#updatedAt = :updatedAt");

    // name
    if (typeof body.name === "string") {
      expressionNames["#name"] = "name";
      expressionValues[":name"] = { S: body.name };
      updateParts.push("#name = :name");
    }

    // notifications
    if (typeof body.notifications === "boolean") {
      expressionNames["#notifications"] = "notifications";
      expressionValues[":notifications"] = { BOOL: body.notifications };
      updateParts.push("#notifications = :notifications");
    }

    // color
    if (typeof body.color === "string" && VALID_COLORS.includes(body.color)) {
      expressionNames["#color"] = "color";
      expressionValues[":color"] = { S: body.color };
      updateParts.push("#color = :color");
    }

    // members
    if (Array.isArray(body.members)) {
      const members = body.members.map((m) => ({
        M: {
          id: { S: m.id },
          name: { S: m.name }
        }
      }));

      expressionNames["#members"] = "members";
      expressionValues[":members"] = { L: members };
      updateParts.push("#members = :members");
    }

    if (updateParts.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No valid fields to update" })
      };
    }

    await client.send(
      new UpdateItemCommand({
        TableName: TABLE_NAME,
        Key: { id: { S: id } },
        UpdateExpression: "SET " + updateParts.join(", "),
        ExpressionAttributeNames: expressionNames,
        ExpressionAttributeValues: expressionValues
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ updated: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
