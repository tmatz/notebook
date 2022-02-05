import { nanoid } from "nanoid";
import { sha256base64 } from "~/utils/sha256";
import appinfo from "/appinfo.json";

export type UserInfo = {
  avatar_url: string;
  id: number;
  name: string;
  state: string;
  username: string;
  web_url: string;
};

const BASE_URL = "https://nxgit.hallab.co.jp";
const ITEM_USER_INFO = "gitlab.userInfo";
const ITEM_ACCESS_TOKEN = "gitlab.accessToken";

export type IGitlabApi = InstanceType<typeof GitlabApi>;

export class GitlabApi {
  #userInfoStr: string | null = null;
  #userInfo: UserInfo | null = null;
  #accessToken: string | null = null;

  private getUserInfo(): UserInfo | null {
    const value = localStorage.getItem(ITEM_USER_INFO);
    if (value !== this.#userInfoStr) {
      this.#userInfoStr = value;
      this.#userInfo = value ? JSON.parse(value) : null;
    }
    return this.#userInfo;
  }

  private setUserInfo(userInfo: UserInfo) {
    const value = JSON.stringify(userInfo);
    if (value !== this.#userInfoStr) {
      this.#userInfoStr = value;
      this.#userInfo = userInfo;
      localStorage.setItem(ITEM_USER_INFO, value);
    }
  }

  private removeUserInfo() {
    localStorage.removeItem(ITEM_USER_INFO);
    this.#userInfoStr = null;
    this.#userInfo = null;
  }

  private getAccessToken(): string | null {
    return localStorage.getItem(ITEM_ACCESS_TOKEN);
  }

  private setAccessToken(accessToken: string) {
    localStorage.setItem(ITEM_ACCESS_TOKEN, accessToken);
  }

  private removeAccessToken() {
    localStorage.removeItem("gitlab.accessToken");
  }

  private get accessToken() {
    if (!this.#accessToken) {
      throw new Error("no access token");
    }
    return this.#accessToken;
  }

  checkLogin() {
    this.#accessToken = this.getAccessToken();
    return this.getUserInfo();
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem("access_token");
  }

  async getOAuthURL(): Promise<string> {
    const state = nanoid();
    const codeVerifier = nanoid(80);
    const codeChallenge = await sha256base64(codeVerifier);
    sessionStorage.setItem("state", state);
    sessionStorage.setItem("codeVerifier", codeVerifier);
    const redirectUri = `${window.location.origin}${
      import.meta.env.BASE_URL
    }login/redirect`;
    const query = {
      client_id: appinfo.id,
      redirect_uri: encodeURIComponent(redirectUri),
      response_type: "code",
      state: state,
      scope: "read_user+read_api+read_repository",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    };
    return `${BASE_URL}/oauth/authorize?${Object.entries(query)
      .map(([key, value]) => `${key}=${value}`)
      .join("&")}`;
  }

  checkOAuthCode(args: {
    code: string | null;
    state: string | null;
  }): Promise<void> {
    const { code, state } = args;
    const savedState = sessionStorage.getItem("state");
    if (!code || !state || state != savedState) {
      return Promise.reject();
    }
    return Promise.resolve();
  }

  async requestOAuthAccessToken(
    code: string
  ): Promise<
    Record<
      | "access_token"
      | "token_type"
      | "expires_in"
      | "refresh_token"
      | "created_at",
      string | null | undefined
    >
  > {
    const codeVerifier = sessionStorage.getItem("codeVerifier")!;
    const redirectUri = `${window.location.origin}${
      import.meta.env.BASE_URL
    }login/redirect`;
    const body = {
      client_id: appinfo.id,
      client_secret: appinfo.secret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    };
    return await window
      .fetch(`${BASE_URL}/oauth/token`, {
        method: "post",
        body: new URLSearchParams(body),
      })
      .then((resp) => resp.json());
  }

  checkAndStoreOAuthAccessToken(args: {
    access_token?: string | null;
    token_type?: string | null;
    refresh_token?: string | null;
    created_at?: string | null;
  }): Promise<void> {
    const { access_token, token_type, refresh_token, created_at } = args;
    if (access_token && token_type && refresh_token && created_at) {
      sessionStorage.setItem("access_token", access_token);
      sessionStorage.setItem("token_type", token_type);
      sessionStorage.setItem("refresh_token", refresh_token);
      sessionStorage.setItem("created_at", created_at);
      return Promise.resolve();
    } else {
      this.resetOAuth();
      return Promise.reject("wrong response");
    }
  }

  resetOAuth(): void {
    sessionStorage.removeItem("state");
    sessionStorage.removeItem("codeVerifier");
    sessionStorage.removeItem("code");
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("token_type");
    sessionStorage.removeItem("refresh_token");
    sessionStorage.removeItem("created_at");
  }

  async login(username: string, token: string) {
    // 渡されたトークンでユーザー情報が取れたらログイン成功
    const response = await fetch(
      `${BASE_URL}/api/v4/users?username=${username}`,
      {
        headers: { "PRIVATE-TOKEN": token },
      }
    );
    const json = await response.json();
    const userInfo = json[0];
    this.setUserInfo(userInfo!);
    this.setAccessToken(token);
    return userInfo!;
  }

  logout() {
    this.#accessToken = null;
    this.removeUserInfo();
    this.removeAccessToken();
  }

  get(url: string, options?: { query?: {} }) {
    const searchParams = new URLSearchParams({
      ...(options?.query ?? {}),
      access_token: sessionStorage.getItem("access_token")!,
    });
    return fetch(`${BASE_URL}${url}?${searchParams}`);
  }

  post(url: string, options?: { query?: {}; body?: {} }) {
    const searchParams = new URLSearchParams({
      ...(options?.query ?? {}),
      access_token: sessionStorage.getItem("access_token")!,
    });
    return fetch(`${BASE_URL}${url}?${searchParams}`, {
      method: "POST",
      body: new URLSearchParams(options?.body),
    });
  }
}
