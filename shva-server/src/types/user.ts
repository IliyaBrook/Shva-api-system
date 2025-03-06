export interface IUser {
  id: number;
  email: string;
}

export interface IUserModel extends IUser {
  password: string;
}