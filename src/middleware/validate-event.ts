import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda"
import { PromiseHandler } from "../utils/promise-handler";
import { z, ZodIssue } from "zod";
import { BadRequestError } from "../utils/http-errors";

export type ValidateEventOptions<TSchema> = {
    schema: TSchema
}

const formatErrors = (errors: ZodIssue[]) => {
    return errors.reduce<Record<string, string[]>>((previous, current) => {
      const path = current.path.join(".");

      if (!previous[path]) {
        previous[path] = [];
      }

      previous[path].push(current.message);

      return previous;
    }, {});
  }

export const validateEvent = <TSchema extends z.ZodTypeAny>(options: ValidateEventOptions<TSchema>) => (
    handler: PromiseHandler<APIGatewayProxyEvent, APIGatewayProxyResult>
): PromiseHandler<APIGatewayProxyEvent, APIGatewayProxyResult> => async (
    event: APIGatewayProxyEvent,
    context: Context
): Promise<APIGatewayProxyResult> => {
    const result = options.schema.safeParse(event);

    if (!result.success) {
        throw new BadRequestError('Validation failed', { errors: formatErrors(result.error.issues) });
    }

    return await handler(event, context);
};