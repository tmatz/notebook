export type UserInfo = {
  avatar_url: string
  id: number
  name: string
  state: string
  username: string
  web_url: string
}

const API_URL = 'https://nxgit.hallab.co.jp/api/'
const ITEM_USER_INFO = 'gitlab.userInfo'
const ITEM_ACCESS_TOKEN = 'gitlab.accessToken'

export class GitlabApi {
  #userInfoStr: string | null = null
  #userInfo: UserInfo | null = null
  #accessToken: string | null = null

  private getUserInfo(): UserInfo | null {
    const value = localStorage.getItem(ITEM_USER_INFO)
    if (value !== this.#userInfoStr) {
      this.#userInfoStr = value
      this.#userInfo = value ? JSON.parse(value) : null
    }
    return this.#userInfo
  }

  private setUserInfo(userInfo: UserInfo) {
    const value = JSON.stringify(userInfo)
    if (value !== this.#userInfoStr) {
      this.#userInfoStr = value
      this.#userInfo = userInfo
      localStorage.setItem(ITEM_USER_INFO, value)
    }
  }

  private removeUserInfo() {
    localStorage.removeItem(ITEM_USER_INFO)
    this.#userInfoStr = null
    this.#userInfo = null
  }

  private getAccessToken(): string | null {
    return localStorage.getItem(ITEM_ACCESS_TOKEN)
  }

  private setAccessToken(accessToken: string) {
    localStorage.setItem(ITEM_ACCESS_TOKEN, accessToken)
  }

  private removeAccessToken() {
    localStorage.removeItem('gitlab.accessToken')
  }

  private get accessToken() {
    if (!this.#accessToken) {
      throw new Error('no access token')
    }
    return this.#accessToken
  }

  checkLogin() {
    this.#accessToken = this.getAccessToken()
    return this.getUserInfo()
  }

  async login(username: string, token: string) {
    // 渡されたトークンでユーザー情報が取れたらログイン成功
    const response = await fetch(`${API_URL}v4/users?username=${username}`, {
      headers: { 'PRIVATE-TOKEN': token },
    })
    const json = await response.json()
    const userInfo = json[0]
    this.setUserInfo(userInfo!)
    this.setAccessToken(token)
    return userInfo!
  }

  logout() {
    this.#accessToken = null
    this.removeUserInfo()
    this.removeAccessToken()
  }

  get(url: string, query?: {}) {
    const params = new URLSearchParams(query)
    return fetch(`${API_URL}${url}?${params}`, {
      headers: { 'PRIVATE-TOKEN': this.accessToken },
    })
  }

  post(url: string) {
    return fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: { 'PRIVATE-TOKEN': this.accessToken },
    })
  }
}
