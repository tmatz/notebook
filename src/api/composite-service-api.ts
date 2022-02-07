import { IServiceApi, User } from "./service-api";

const SERVICE_NAME = "composite_service";

type SessionKey = "serviceName";

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

  setCurrent(serviceName: string) {
    this.#current = this.services.find((s) => s.serviceName === serviceName);
    if (!this.#current) {
      removeSessionValue("serviceName");
      throw new Error("service not found");
    }
    setSessionValue("serviceName", serviceName);
  }

  get serviceName(): string {
    if (!this.current) {
      throw new Error("current service is not set");
    }
    return this.current.serviceName;
  }

  isLoggedIn(): boolean {
    return !!this.current?.isLoggedIn()!;
  }

  boot(): Promise<User | undefined> {
    if (!this.current) {
      const serviceName = getSessionValue("serviceName");
      if (!serviceName) {
        throw new Error("current service is not set");
      }
      this.setCurrent(serviceName);
    }
    return this.current!.boot();
  }

  login(): Promise<boolean> {
    if (!this.current) {
      throw new Error("current service is not set");
    }
    return this.current.login();
  }

  async logout(): Promise<void> {
    if (!this.current) {
      throw new Error("current service is not set");
    }
    try {
      await this.current.logout();
    } finally {
      this.#current = undefined;
      removeSessionValue("serviceName");
    }
  }
}

function getSessionValue(key: SessionKey): string | null {
  return sessionStorage.getItem(`notebook/${SERVICE_NAME}/${key}`);
}

function setSessionValue(key: SessionKey, value: string) {
  sessionStorage.setItem(`notebook/${SERVICE_NAME}/${key}`, value);
}

function removeSessionValue(key: SessionKey) {
  return sessionStorage.removeItem(`notebook/${SERVICE_NAME}/${key}`);
}
