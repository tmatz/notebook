import { IServiceApi, User } from "./service-api";

export class CompositeServiceApi implements IServiceApi {
  #services: IServiceApi[];
  #current?: IServiceApi;

  constructor(services: IServiceApi[]) {
    this.#services = services;
  }

  get services() {
    return this.#services;
  }

  get current() {
    return this.#current;
  }

  setCurrent(name: string) {
    this.#current = this.services.find((s) => s.serviceName === name);
  }

  get serviceName(): string {
    if (!this.current) {
      throw new Error("current service is not set");
    }
    return this.current.serviceName;
  }

  isLoggedIn(): boolean {
    if (!this.current) {
      throw new Error("current service is not set");
    }
    return this.current?.isLoggedIn()!;
  }

  boot(): Promise<User | undefined> {
    if (!this.current) {
      throw new Error("current service is not set");
    }
    return this.current.boot();
  }

  login(): Promise<void> {
    if (!this.current) {
      throw new Error("current service is not set");
    }
    return this.current.login();
  }

  checkLogin(): Promise<User | undefined> {
    if (!this.current) {
      throw new Error("current service is not set");
    }
    return this.current.checkLogin();
  }

  logout(): Promise<void> {
    if (!this.current) {
      throw new Error("current service is not set");
    }
    return this.current.logout();
  }
}
