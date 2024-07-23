// cors.d.ts
import { RequestHandler } from 'express';

declare module 'cors' {
  interface CorsOptions {
    origin?: boolean | string | RegExp | (string | RegExp)[] | CustomOrigin;
    methods?: string | string[];
    allowedHeaders?: string | string[];
    exposedHeaders?: string | string[];
    credentials?: boolean;
    maxAge?: number;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
  }

  type CustomOrigin = (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => void;

  function cors(options?: CorsOptions): RequestHandler;

  export = cors;
}
