export type UserRole = "client" | "owner" | "admin";

export type AuthUser = {
  id: number;
  name: string;
  email: string | null;
  picture: string | null;
  role: UserRole;
};

export type AuthResult = {
  user: AuthUser;
  token: string;
};
