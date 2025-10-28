import type {
  LoginPayLoad,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "@/types/user";
import request from "@/utils/request";

export const loginApi = async (
  payload: LoginPayLoad
): Promise<LoginResponse> => {
  const { data } = await request.post<LoginResponse>("/login", payload);
  return data;
};

export const registerApi = (
  payload: RegisterPayload
): Promise<RegisterResponse> => {
  return request.post("/register", payload);
};
