import type { IUser } from '@/types/user'

export default class UserDto {
  email: string;
  id: number;
  constructor(model: IUser) {
    this.email = model.email;
    this.id = model.id;
  }
}