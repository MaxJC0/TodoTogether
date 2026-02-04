import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.BOARDS_TABLE_NAME;

const VALID_COLORS = ["black", "blue", "green", "yellow", "red", "purple"];

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const id = randomUUID();

    //Validate color
    const color = VALID_COLORS.includes(body.color) ? body.color : "black";

    //Normalize members list
    const members = Array.isArray(body.members)
      ? body.members.map((member) => ({
        M: {
          id: { S: member.id },
          name: { S: member.name },
        }
      }))
      : [];

    await client.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: {
          id: { S: id },
          name: { S: body.name },
          createdAt: { S: new Date().toISOString() },
          udpatedAt: { S: new Date().toISOString() },
          members: { L: members },
          notifications: { BOOL: body.notifications || false },
          color: { S: color }
        }
      })
    );

    return {
      statusCode: 201,
      body: JSON.stringify({ id, name: body.name })
    };
  } catch (err) {
    return (
      {
        statusCode: 500,
        body: JSON.stringify({ message: err.message })
      })
  }
}
