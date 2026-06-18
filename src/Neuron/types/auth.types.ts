export interface ILoginUserRequest {
  email: string;
  password: string;
}

export interface ILoginData {
  email: string;
  token: string;
}

export interface ILoginResponse {
  success: boolean;
  message: string;
  data: ILoginData;
}
