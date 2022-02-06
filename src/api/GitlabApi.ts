import { nanoid } from "nanoid";
import { sha256base64 } from "~/utils/sha256";
import type { IService, User } from "./serviceApi";
import appinfo from "/appinfo.json";

const BASE_URL = "https://nxgit.hallab.co.jp";
const SERVICE_NAME = "gitlab";

export type IGitlabApi = InstanceType<typeof GitlabApi>;

type RequestAccessTokenResponse = {
  access_token: string | null | undefined;
  token_type: string | null | undefined;
  refresh_token: string | null | undefined;
  created_at: string | null | undefined;
};

type SessionKey =
  | "state"
  | "code_verifier"
  | "code"
  | "access_token"
  | "token_type"
  | "refresh_token"
  | "created_at";

export class GitlabApi implements IService {
  get serviceName() {
    return "gitlab";
  }

  isLoggedIn(): boolean {
    return !!getSessionValue("access_token");
  }

  async boot(): Promise<User> {
    if (!this.isLoggedIn()) {
      return Promise.reject();
    }
    return await this.getCurrentUser();
  }

  async login(): Promise<void> {
    const url = await this.getOAuthCodeURL();
    window.location.href = url;
  }

  async checkLogin(): Promise<User> {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      await this.checkOAuthCode({ code, state });
      const json = await this.requestOAuthAccessToken(code!);
      await this.checkAndStoreOAuthAccessToken(json);
      const user = await this.getCurrentUser();
      return user;
    } catch {
      this.resetOAuth();
      return Promise.reject("wrong response");
    }
  }

  logout(): Promise<void> {
    this.resetOAuth();
    return Promise.resolve();
  }

  private async getOAuthCodeURL(): Promise<string> {
    const state = nanoid();
    const code_verifier = nanoid(80);
    const code_challenge = await sha256base64(code_verifier);
    setSessionValue("state", state);
    setSessionValue("code_verifier", code_verifier);
    const redirect_uri = `${window.location.origin}${
      import.meta.env.BASE_URL
    }login/redirect`;
    const query = {
      client_id: appinfo.id,
      redirect_uri: encodeURIComponent(redirect_uri),
      response_type: "code",
      state: state,
      scope: "read_user+read_api+read_repository",
      code_challenge,
      code_challenge_method: "S256",
    };
    return `${BASE_URL}/oauth/authorize?${new URLSearchParams(query)}`;
  }

  private checkOAuthCode(args: {
    code: string | null;
    state: string | null;
  }): Promise<void> {
    const { code, state } = args;
    const savedState = getSessionValue("state");
    if (!code || !state || state != savedState) {
      return Promise.reject();
    }
    return Promise.resolve();
  }

  private async requestOAuthAccessToken(
    code: string
  ): Promise<RequestAccessTokenResponse> {
    const code_verifier = getSessionValue("code_verifier")!;
    const redirect_uri = `${window.location.origin}${
      import.meta.env.BASE_URL
    }login/redirect`;
    return await this.post("/oauth/token", {
      body: {
        client_id: appinfo.id,
        client_secret: appinfo.secret,
        code,
        grant_type: "authorization_code",
        redirect_uri,
        code_verifier,
      },
    });
  }

  private checkAndStoreOAuthAccessToken(
    args: RequestAccessTokenResponse
  ): Promise<void> {
    const { access_token, token_type, refresh_token, created_at } = args;
    if (access_token && token_type && refresh_token && created_at) {
      setSessionValue("access_token", access_token);
      setSessionValue("token_type", token_type);
      setSessionValue("refresh_token", refresh_token);
      setSessionValue("created_at", created_at);
      return Promise.resolve();
    } else {
      this.resetOAuth();
      return Promise.reject("wrong response");
    }
  }

  private resetOAuth(): void {
    removeSessionValue("state");
    removeSessionValue("code_verifier");
    removeSessionValue("code");
    removeSessionValue("access_token");
    removeSessionValue("token_type");
    removeSessionValue("refresh_token");
    removeSessionValue("created_at");
  }

  private getCurrentUser(): Promise<User> {
    return this.get("/api/v4/user");
  }

  private async get(url: string, options: { query?: {} } = {}): Promise<any> {
    const { query } = options;
    const access_token = getSessionValue("access_token")!;
    const searchParams = new URLSearchParams({ ...query, access_token });
    const resp = await fetch(`${BASE_URL}${url}?${searchParams}`);
    return await resp.json();
  }

  private async post(
    url: string,
    options: { query?: {}; body?: {} } = {}
  ): Promise<any> {
    const { query, body } = options;
    const access_token = getSessionValue("access_token")!;
    const searchParams = new URLSearchParams({ ...query, access_token });
    const resp = await fetch(`${BASE_URL}${url}?${searchParams}`, {
      method: "POST",
      body: new URLSearchParams(body),
    });
    return await resp.json();
  }
}

function getSessionValue(key: SessionKey): string | null {
  return sessionStorage.getItem(`${SERVICE_NAME}/${key}`);
}

function setSessionValue(key: SessionKey, value: string) {
  sessionStorage.setItem(`${SERVICE_NAME}/${key}`, value);
}

function removeSessionValue(key: SessionKey) {
  return sessionStorage.removeItem(`${SERVICE_NAME}/${key}`);
}
