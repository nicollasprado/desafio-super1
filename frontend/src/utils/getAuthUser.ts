import api from '$lib/AxiosService'
import type { IUser } from '$lib/interfaces/IUser'

const getAuthUser = async (): Promise<IUser | null> => {
  try {
    const resMe = await api.axios.get<IUser>('/auth/me')

    if (resMe.status !== 200) {
      return null
    }

    return resMe.data
  } catch {
    return null
  }
}

export default getAuthUser
