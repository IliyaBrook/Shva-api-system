import ApiError from '@/exceptions/api-error'
import { Request, Response, NextFunction } from 'express';

export default function errorMiddleware(err: unknown, req: Request, res: Response, next: NextFunction):void {
  if (err instanceof ApiError) {
    res.status(err.status).json({ message: err.message, errors: err.errors });
    return
  }
  res.status(500).json({ message: 'Unknown error' });
}