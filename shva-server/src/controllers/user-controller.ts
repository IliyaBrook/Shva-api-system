import ApiError from '@/exceptions/api-error'
import userService from '@/service/user-service'
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

const days30InSec = 30 * 24 * 60 * 60 * 1000;

class UserController {
  async registration(req: Request, res: Response, next: NextFunction):Promise<void | Response<Response, Record<string, any>>> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', errors.array()));
      }
      const { email, password } = req.body;
      const userData = await userService.registration(email, password);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: days30InSec, httpOnly: true });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: days30InSec, httpOnly: true });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: days30InSec, httpOnly: true });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }
}

export default new UserController();