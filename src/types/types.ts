// src/types.ts

export interface ILoginCredentials {
  credentials: string;
  password: string;
  rememberMe?: boolean;
}

export interface IAuthResponse {
  access_token: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface IAuthRegisterCredentials {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}
