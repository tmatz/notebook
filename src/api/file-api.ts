import type { IServiceApi, User } from "./service-api";

export class FileApi implements IServiceApi {
  get serviceName(): string {
    return "file";
  }

  isLoggedIn(): boolean {
    return true;
  }

  boot(): Promise<User | undefined> {
    return Promise.resolve(undefined);
  }

  login(): Promise<void> {
    return Promise.resolve();
  }

  checkLogin(): Promise<undefined> {
    return Promise.resolve(undefined);
  }

  logout(): Promise<void> {
    return Promise.resolve();
  }
}
