import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";

let client = new DynamoDBClient();

const tableName = process.env.TODO_TABLE_NAME;

const getResponse = (statusCode: number, body: unknown) => {
  const response = {
    statusCode,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: JSON.stringify(body),
  };
  return response;
};

export const putTodoHandler = async (event: APIGatewayProxyEvent) => {
  if (!event.body) {
    return getResponse(400, { message: "Body is required" });
  }
  try {
    console.info("received", event);
    const { id, name } = JSON.parse(event.body);

    const command = new PutItemCommand({
      Item: {
        id: { S: id },
        name: { S: name },
      },
      TableName: tableName,
    });

    const result = await client.send(command);
    console.log(`response from ${event.path}`);

    return getResponse(200, { id, name });
  } catch (error) {
    console.error("Error:", error);
    return getResponse(500, { message: "Internal Server Error" });
  }
};
