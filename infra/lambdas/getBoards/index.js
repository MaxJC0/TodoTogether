const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.BOARDS_TABLE_NAME;

exports.handler = async () => {
  try {
    const result = await client.send(
      new ScanCommand({
        TableName: TABLE_NAME,
      })
    );

    const items = result.Items?.map(item => ({
      id: item.id.S,
      ...Object.fromEntries(
        Object.entries(item).filter(([k]) => k !== "id").map(([k, v]) => [k, v.S])
      )
    })) || [];

    return {
      statusCode: 200,
      body: JSON.stringify(items)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
