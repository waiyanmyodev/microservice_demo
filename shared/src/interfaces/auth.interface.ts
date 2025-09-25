export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface IAuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface IRefreshTokenRequest {
  refreshToken: string;
}

export interface IJwtPayload {
  sub: string;
  email: string;
  username: string;
  iat?: number;
  exp?: number;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IValidateUserRequest {
  email: string;
  password: string;
}