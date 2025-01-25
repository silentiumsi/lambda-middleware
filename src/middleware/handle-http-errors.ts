import { Middleware } from "../types";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HttpError, InternalServerError } from "../utils/http-errors";

export const handleHttpErrors: Middleware<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> = (handler) => async (event, context) => {
  try {
    return await handler(event, context);
  } catch (error) {
    if (error instanceof HttpError) {
      return {
        statusCode: error.status,
        body: JSON.stringify(error.serialize()),
      };
    }
    
    const e = new InternalServerError();

    return {
      statusCode: e.status,
      body: JSON.stringify(e.serialize()),
    };
  }
};
