export type User = {
  username: string;
  name: string;
};

export interface IServiceApi {
  get serviceName(): string;
  isLoggedIn(): boolean;
  boot(): Promise<User | undefined>;
  /** @return succss: true, pending: false, error: failed */
  login(): Promise<boolean>;
  logout(): Promise<void>;
}
