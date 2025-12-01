export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthState extends AuthTokens {
  user: User | null;
  isAuthenticated: boolean;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface LoginRequest {
  email?: string;
  password?: string;
}

export interface RegisterRequest {
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  re_password?: string;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
}

export interface GoogleLoginRequest {
  auth_token: string; // The ID Token from Google
}