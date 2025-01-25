import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { handleHttpErrors } from "../middleware/handle-http-errors";
import { validateEvent } from "../middleware/validate-event";
import { z } from "zod";
import logger from "../utils/logger";
import { addLogContext } from "../middleware/add-log-context";
import { compose } from "../utils/compose";

const eventSchema = z.object({
  body: z.string(),
});

export const handleCommand = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log({ event, context });
  logger.log({ msg: "this is a log message..." });

  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
};

export const handler = compose(
  handleCommand,
  handleHttpErrors,
  validateEvent({ schema: eventSchema}),
  addLogContext
)
