import type { IUserResponse } from "@/types/api-response";

export interface IGlobalContext {
  isAuthorized: boolean;
  setIsAuthorized: (isAuthorized: boolean) => void;
  users: IUserResponse[] | [];
  setUsers: (newState: IUserResponse[] | []) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}
