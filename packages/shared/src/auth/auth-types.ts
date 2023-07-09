import { User } from '../user';

export interface AccessToken {
  token?: string;
  user: User;
}

export interface ApiKey {
  id: number;
  apiKey: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
  remember: boolean;
}
