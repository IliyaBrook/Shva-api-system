import ApiError from '@/exceptions/api-error'
import { Request, Response, NextFunction } from 'express';

export default function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ApiError) {
    res.status(err.status).json({ message: err.message, errors: err.errors });
    return
  }
  res.status(500).json({ message: 'Unknown error' });
}