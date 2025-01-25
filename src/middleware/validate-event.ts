import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

import { ZodIssue, ZodTypeAny } from "zod";
import { BadRequestError } from "../utils/http-errors";
import { Middleware} from "../types";

export type ValidateEventOptions<TSchema extends ZodTypeAny> = {
  schema: TSchema;
};

const formatErrors = (errors: ZodIssue[]) => {
  return errors.reduce<Record<string, string[]>>((previous, current) => {
    const path = current.path.join(".");

    if (!previous[path]) {
      previous[path] = [];
    }

    previous[path].push(current.message);

    return previous;
  }, {});
};

export const validateEvent: Middleware<
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  ValidateEventOptions<ZodTypeAny>
> =
  <TSchema extends ZodTypeAny>(options: ValidateEventOptions<TSchema>) =>
  (handler) =>
  async (event, context) => {
    const result = options.schema.safeParse(event);

    if (!result.success) {
      throw new BadRequestError("Validation failed", {
        errors: formatErrors(result.error.issues),
      });
    }

    return await handler(event, context);
  };
