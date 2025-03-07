import type { IUser } from "./user.ts";

interface IErrorResponse {
  message: string;
  errors: unknown[];
}

interface IAuthSuccessResponse {
  accessToken: string;
  refreshToken: string;
  users: IUser & { id: string };
}

export interface IUserResponse {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  createdAt: string;
  updatedAt: string;
}

export type IUsersResponse = IUserResponse[] | IErrorResponse;
export type IAuthResponse = IAuthSuccessResponse | IErrorResponse;
