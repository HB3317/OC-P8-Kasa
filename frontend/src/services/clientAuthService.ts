import { httpClient } from "@/services/httpClient";
import type { AuthUser } from "@/types/auth";

type Credentials = {
  email: string;
  password: string;
};

type Registration = Credentials & {
  name: string;
};

type AuthResponse = {
  user: AuthUser;
};

export function login(
  credentials: Credentials,
): Promise<AuthResponse> {
  return httpClient.post<AuthResponse, Credentials>(
    "/api/auth/login",
    credentials,
  );
}

export function register(
  registration: Registration,
): Promise<AuthResponse> {
  return httpClient.post<AuthResponse, Registration>(
    "/api/auth/register",
    registration,
  );
}

export function logout(): Promise<{ ok: boolean }> {
  return httpClient.post<{ ok: boolean }, undefined>("/api/auth/logout", undefined);
}
