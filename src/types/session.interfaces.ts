export interface RawSession {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  loginAt: Date;
  expirationAt: Date;
  refreshExpirationAt: Date;
}

export interface PlainSession {
  accessToken: string;
  refreshToken: string;
  loginAt: string;
  expirationAt: string;
  refreshExpirationAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}
