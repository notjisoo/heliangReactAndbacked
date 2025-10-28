// hooks/useRegister.ts
import { useMutation } from "@tanstack/react-query";
import { registerApi } from "@/api/auth";
import type { RegisterPayload } from "@/types/user";

export const useRegister = () => {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerApi(payload),
  });
};
