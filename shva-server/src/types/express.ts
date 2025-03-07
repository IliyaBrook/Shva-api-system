import type { IUser } from "@/types/user";
import { Request as RequestExpress } from "express";

export interface Request extends RequestExpress {
  user?: IUser;
}
