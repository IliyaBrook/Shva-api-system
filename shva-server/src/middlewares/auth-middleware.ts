import ApiError from '@/exceptions/api-error'
import tokenService from '@/service/token-service'
import { Request, Response, NextFunction } from 'express';

export default function authMiddleware(req: Request, _res: Response, next: NextFunction){
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      next(ApiError.UnauthorizedError());
      return
    }
    
    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      next(ApiError.UnauthorizedError());
      return
    }
    
    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      next(ApiError.UnauthorizedError());
      return
    }
    
    req.user = userData;
    next();
  } catch (e) {
    next(ApiError.UnauthorizedError());
  }
}