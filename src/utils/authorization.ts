import { AxiosHeaders } from "axios";
import { useAuthStore } from "../store";
import { jwtExpiration } from "./auth";

export const getAuthorizationHeaders = (): AxiosHeaders => {
  const { user, logout } = useAuthStore.getState();
  const headers = new AxiosHeaders();

  if (user && user.token) {
    if(!jwtExpiration(user.token)){
      headers.set("Authorization", `Bearer ${user.token}`);
    }else{
      logout();
    }
  }

  return headers;
};

export const getHeaders = () => ({
  Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJoZWxwQGRvY3Rvci5jb20iLCJleHAiOjQ4OTkwNTk4NTR9.wQ9FPIYuXnZMPkfyC00cUSA9eOp8di6ZJkAUg7xPmqM`,
  'Content-Type': 'application/json', // Agrega esto si tu backend lo espera
});
