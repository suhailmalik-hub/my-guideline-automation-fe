import type { ILoginResponse, ILoginUserRequest } from '../types';
import { axiosInstance } from './executer';

const API_ENDPOINT = '/auth/login';

export const LoginUser = async (loginUser: ILoginUserRequest) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, loginUser);
    return response as unknown as ILoginResponse;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
