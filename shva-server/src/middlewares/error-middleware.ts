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
    return;
  }
  const message = process.env.NODE_ENV === 'development'
    ? (err instanceof Error ? err.message : String(err))
    : 'Unknown error';
  res.status(500).json({ message });
}