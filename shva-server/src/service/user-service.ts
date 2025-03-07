import UserDto from "@/dtos/user-dto";
import ApiError from "@/exceptions/api-error";
import { User } from "@/models/user-model";
import type { IUserModel, IUserWithPass } from "@/types/user";
import bcrypt from "bcrypt";

import tokenService from "./token-service";

class UserService {
  async registration({
    email,
    password,
    lastname,
    firstname,
  }: IUserWithPass): Promise<{
    user: UserDto;
    accessToken: string;
    refreshToken: string;
  }> {
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      throw ApiError.BadRequest(`User with email ${email} already exists`);
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const user = await User.create({
      email,
      password: hashPassword,
      lastname,
      firstname,
    });
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: UserDto; accessToken: string; refreshToken: string }> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw ApiError.BadRequest("Login error, please check your credentials");
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Login error, please check your credentials");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken: string): Promise<number> {
    return await tokenService.removeToken(refreshToken);
  }

  async refresh(
    refreshToken: string,
  ): Promise<{ user: UserDto; accessToken: string; refreshToken: string }> {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);

    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = (await User.findByPk((userData as IUserModel).id)) as User;
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async getAllUsers(): Promise<User[]> {
    return await User.findAll();
  }
}

export default new UserService();
