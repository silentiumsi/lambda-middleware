import { Middleware, PromiseHandler } from "../types";


export const compose = <TEvent = any, TResult = any>(
    handler: PromiseHandler<TEvent, TResult>,
    ...middlewares: Middleware<TEvent, TResult>[]
  ): PromiseHandler<TEvent, TResult> => {
    return middlewares.reduceRight((nextHandler, middleware) => {
      // Automatically finalize curried middleware with no arguments
      if (typeof middleware === 'function' && middleware.length === 1) {
        return middleware(nextHandler as PromiseHandler<TEvent, TResult>);
      } else if (typeof middleware === 'function') {
        return (middleware as any)()(nextHandler);
      }
      return nextHandler;
    }, handler);
  };