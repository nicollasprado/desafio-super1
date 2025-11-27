import axios from 'axios'

class AxiosService {
  private axiosInstance
  private accessToken: string | null = null

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      withCredentials: true,
    })

    this.axiosInstance.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`
      }

      return config
    })

    this.axiosInstance.interceptors.response.use(undefined, async (error) => {
      if (error.response.status === 401) {
        await this.refreshToken()
        return this.axiosInstance(error.config)
      }

      throw error
    })
  }

  private async refreshToken() {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
      withCredentials: true,
    })

    this.setAccessToken(res.data.token)
  }

  public get axios() {
    return this.axiosInstance
  }

  public setAccessToken(token: string) {
    this.accessToken = token
  }

  public async isAuthenticated() {
    await this.refreshToken()
    return this.accessToken !== null
  }

  public async logout() {
    await this.axiosInstance.get(`/auth/logout`)
    this.accessToken = null
  }
}

const api = new AxiosService()
export default api
