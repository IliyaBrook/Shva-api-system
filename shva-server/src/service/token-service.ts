import { Token } from '@/models/token-model'
import type { IUser } from '@/types/user'
import jwt, { type JwtPayload } from 'jsonwebtoken'

class TokenService {
  generateTokens(payload: IUser) : { accessToken: string, refreshToken: string } {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, { expiresIn: '30m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '30d' });
    return {
      accessToken,
      refreshToken
    };
  }
  validateAccessToken(token: string): string | JwtPayload | null {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
    } catch {
      return null;
    }
  }
  validateRefreshToken(token: string): string | JwtPayload | null {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
    } catch {
      return null;
    }
  }
  async saveToken(userId: number, refreshToken: string): Promise<Token> {
    const tokenData = await Token.findOne({ where: { user: userId } });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    return await Token.create({ user: userId, refreshToken });
  }
  async removeToken(refreshToken: string): Promise<number> {
    return await Token.destroy({ where: { refreshToken } });
  }
  async findToken(refreshToken: string): Promise<Token | null> {
    return await Token.findOne({ where: { refreshToken } });
  }
}

export default new TokenService();