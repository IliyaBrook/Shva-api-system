import { Token } from "@/models/token-model";
import type { IUser } from "@/types/user";
import jwt from "jsonwebtoken";

class TokenService {
  generateTokens(payload: IUser) {
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: "30m" },
    );
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "30d" },
    );
    return {
      accessToken,
      refreshToken,
    };
  }
  validateAccessToken(token: string): IUser | null {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET as string,
      );
      if (typeof decoded === "string") {
        return null;
      }
      return decoded as IUser;
    } catch {
      return null;
    }
  }
  validateRefreshToken(token: string): IUser | null {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET as string,
      );
      if (typeof decoded === "string") {
        return null;
      }
      return decoded as IUser;
    } catch {
      return null;
    }
  }
  async saveToken(userId: number, refreshToken: string) {
    const tokenData = await Token.findOne({ where: { user: userId } });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    return await Token.create({ user: userId, refreshToken });
  }
  async removeToken(refreshToken: string) {
    return await Token.destroy({ where: { refreshToken } });
  }
  async findToken(refreshToken: string) {
    return await Token.findOne({ where: { refreshToken } });
  }
}

export default new TokenService();
