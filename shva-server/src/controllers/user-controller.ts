import UserDto from "@/dtos/user-dto";
import ApiError from "@/exceptions/api-error";
import userService from "@/service/user-service";
import type { IUserWithPass } from "@/types/user";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

const days30InSec = 30 * 24 * 60 * 60 * 1000;

class UserController {
  async registration(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const body = req.body as IUserWithPass;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }
      const { email, password, firstname, lastname } = body;
      const userData = await userService.registration({
        email,
        firstname,
        lastname,
        password,
      });
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: days30InSec,
        httpOnly: true,
      });
      res.json(userData);
    } catch (e: unknown) {
      next(e);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: days30InSec,
        httpOnly: true,
      });
      res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async refresh(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: days30InSec,
        httpOnly: true,
      });
      res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const users = await userService.getAllUsers(page, limit);
      const usersData = users.map((user) => new UserDto(user));
      res.json(usersData);
    } catch (e) {
      next(e);
    }
  }
}

export default new UserController();
