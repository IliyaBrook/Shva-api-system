import type { IUserResponse } from '@/types/api-response'

export interface IGlobalContext {
  isAuthorized: boolean;
  setIsAuthorized: (isAuthorized: boolean) => void;
  users: IUserResponse[] | [];
  setGlobalState: (newState: Partial<IGlobalContext>) => void;
}