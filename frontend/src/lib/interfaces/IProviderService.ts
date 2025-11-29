import type IVariant from './IVariant'

export default interface IProviderService {
  id: string
  description: string
  imagesUrls: string[]
  provider: {
    id: string
    firstName: string
    lastName: string
    avatarUrl: string
  }
  service: {
    id: string
    name: string
  }
  variants: IVariant[]
  schedules: {
    id: string
    weekdays: number[]
    start: number
    end: number
  }[]
}
