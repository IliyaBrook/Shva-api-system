import type { IUserModel } from "@/types/user";

export default class UserDto {
  email: string;
  id: number;
  firstname: string;
  lastname: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  constructor(model: IUserModel) {
    this.id = model.id;
    this.email = model.email;
    this.firstname = model.firstname;
    this.lastname = model.lastname;
    if (model.createdAt && model.updatedAt) {
      this.createdAt = model.createdAt;
      this.updatedAt = model.updatedAt;
    }
  }
}
