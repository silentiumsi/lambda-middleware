import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import logger from "../utils/logger";
import { Middleware } from "../types";


export const addLogContext: Middleware<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> = (handler) => async (event, context) => {
  logger.addContext({ custom: "context-value" });

  return await handler(event, context);
};
