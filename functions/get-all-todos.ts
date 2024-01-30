import { APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

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

export const getAllTodosHandler = async (event: APIGatewayProxyEvent) => {
  try {
    console.info("received", event);

    const command = new ScanCommand({
      TableName: tableName,
    });
    const data = await client.send(command);

    if (!data) {
      return getResponse(404, { message: "No todos found" });
    }

    return getResponse(404, { body: data.Items });
  } catch (error) {
    console.error("Error:", error);
    return getResponse(500, { message: "Internal Server Error" });
  }
};
