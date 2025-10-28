import type axios from "axios";

export interface User {
  id: string;
  name: string;
  token: string;
  expreis?: string;
}

export interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

// login
export interface LoginPayLoad {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  code: number;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      username: string;
    };
  };
}

// 注册
export interface RegisterPayload {
  username: string;
  password: string;
}

export interface RegisterResponse {
  success: string;
  code: number;
}
