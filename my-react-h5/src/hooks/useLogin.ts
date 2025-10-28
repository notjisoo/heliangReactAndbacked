import { loginApi } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import type { LoginPayLoad, LoginResponse } from "@/types/user";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/stores/user";

export const useLogin = () => {
  const setUser = useUserStore((s) => s.setUser);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: LoginPayLoad) => loginApi(payload),
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (data: LoginResponse) => {
      // console.log(data);
      // 登录成功后，把用户信息存到 Zustand
      setUser({ ...data.data.user, token: data.data.token });
      localStorage.setItem("token", data.data.token);
      navigate("/profile");
    },
  });
};
