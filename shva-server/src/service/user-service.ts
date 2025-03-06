import { User } from '@/models/user-model'
import bcrypt from 'bcrypt';
import tokenService from './token-service';
import UserDto from '../dtos/user-dto';
import ApiError from '../exceptions/api-error';

class UserService {
  async registration(email: string, password: string)  {
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      throw ApiError.BadRequest(`User with email ${email} already exists`);
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const user = await User.create({ email, password: hashPassword });
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto
    };
  }
  async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw ApiError.BadRequest('Login error, please check your credentials');
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Login error, please check your credentials');
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto
    };
  }
  async logout(refreshToken: string) {
    return await tokenService.removeToken(refreshToken);
  }
  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await User.findByPk(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto
    };
  }
  async getAllUsers() {
    return await User.findAll();
  }
}

export default new UserService();