import * as cdk from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Code, Runtime, Function } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export class CdkDemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB table
    const todoTable = new Table(this, "todo", {
      partitionKey: { name: "name", type: AttributeType.STRING },
    });

    // Lamda function GetAllTodos Lamda Handler
    const getAllTodosLamda = new Function(this, "GetAllTodosLamdaHandler", {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset("functions"), // Define from folder we will read lamda handler code
      handler: "get-all-todos.getAllTodosHandler",
      timeout: cdk.Duration.seconds(300),
      environment: {
        TODO_TABLE_NAME: todoTable.tableName,
      },
    });

    // Grant read/write permission to lamda function on dynamoDB table
    todoTable.grantReadWriteData(getAllTodosLamda);

    // Lamda function PUTTodo Lamda Handler
    const putTodoLamda = new Function(this, "PutTodoLamdaHandler", {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset("functions"),
      handler: "put-todo.putTodoHandler",
      timeout: cdk.Duration.seconds(300),
      environment: {
        TODO_TABLE_NAME: todoTable.tableName,
      },
    });

    todoTable.grantReadWriteData(putTodoLamda);

    const api = new RestApi(this, "todo-api");
    api.root
      .resourceForPath("todo")
      .addMethod("GET", new LambdaIntegration(getAllTodosLamda));

    api.root
      .resourceForPath("todo")
      .addMethod("POST", new LambdaIntegration(putTodoLamda));

    //  CloudFormation Output for the API URL
    new cdk.CfnOutput(this, "API URL", {
      value: api.url ?? "Something went wrong", // fallback in case the URL is not available
    });
  }
}
