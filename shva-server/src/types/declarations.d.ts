/* eslint-disable */
//@ts-expect-error
import { Request } from 'express';

declare global {
  namespace Express {
    export interface Request {
      user?: unknown;
    }
  }
}
