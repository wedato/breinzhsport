export interface User {
  id: number;
  email: string;
  username: string;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
