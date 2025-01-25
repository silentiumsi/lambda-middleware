import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda"
import { HttpError, InternalServerError } from "../utils/http-errors";
import { PromiseHandler } from "../utils/promise-handler";


export const handleHttpErrors = () => (
    handler: PromiseHandler<APIGatewayProxyEvent, APIGatewayProxyResult>
): PromiseHandler<APIGatewayProxyEvent, APIGatewayProxyResult> => async (
    event: APIGatewayProxyEvent,
    context: Context
): Promise<APIGatewayProxyResult> => {
    try {
        return await handler(event, context);
    } catch (error) {
        if (error instanceof HttpError) {
            return {
                statusCode: error.status,
                body: JSON.stringify(error.serialize())
            }
        }

        const e = new InternalServerError();

        return {
            statusCode: e.status,
            body: JSON.stringify(e.serialize())
        }
    }
}