export type User = {
  username: string;
  name: string;
};

export interface IServiceApi {
  get serviceName(): string;
  isLoggedIn(): boolean;
  boot(): Promise<User | undefined>;
  login(): Promise<void>;
  checkLogin(): Promise<User | undefined>;
  logout(): Promise<void>;
}
