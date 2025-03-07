export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserWithPass extends IUser {
  password: string;
}
export interface IUserModel extends IUserWithPass {
  id: number;
}