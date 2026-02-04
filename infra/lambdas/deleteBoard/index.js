
const { DynamoDBClient, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.BOARDS_TABLE_NAME;

exports.handler = async (event) => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing id" }) };
    }

    await client.send(
      new DeleteItemCommand({
        TableName: TABLE_NAME,
        Key: { id: { S: id } }
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ deleted: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
