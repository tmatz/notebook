export type User = {
  username: string;
  name: string;
};

export interface IService {
  get serviceName(): string;
  isLoggedIn(): boolean;
  boot(): Promise<User | undefined>;
  login(): Promise<void>;
  checkLogin(): Promise<User>;
  logout(): Promise<void>;
}
