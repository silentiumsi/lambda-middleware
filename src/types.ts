import { Context } from "aws-lambda";

export type Middleware<
  TEvent = any,
  TResult = any,
  TOptions = void
> = TOptions extends void
  ? (
      handler: PromiseHandler<TEvent, TResult>
    ) => PromiseHandler<TEvent, TResult>
  : (
      options: TOptions
    ) => (
      handler: PromiseHandler<TEvent, TResult>
    ) => PromiseHandler<TEvent, TResult>;

export type PromiseHandler<TEvent = any, TResult = any> = (
  event: TEvent,
  context: Context
) => Promise<TResult>;
