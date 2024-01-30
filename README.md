# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template

## Deployment

1- Write your typescript code.
2- Build `npm run build` compile typescript to js
3- Synthesizing `cdk synth` creates cdk.out folder cloudformation template
4- Bootstrap `cdk bootstrap aws://ACCOUNT-NUMBER/REGION` this command is used in the AWS Cloud Development Kit (CDK) to set up an AWS CloudFormation environment in your AWS account. This is a necessary step before deploying CDK applications. (only first time)
5- Deploy `cdk deploy`
