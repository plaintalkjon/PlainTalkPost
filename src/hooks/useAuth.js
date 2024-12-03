import { useMutation } from '@tanstack/react-query';
import { login, signup } from "@services/authServices";

export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password }) => login(email, password),
    onError: (error) => {
      // You might want to format the error message here
      throw new Error(error.message);
    }
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: ({ email, password, username }) => 
      signup(email, password, username),
    onError: (error) => {
      throw new Error(error.message);
    }
  });
}