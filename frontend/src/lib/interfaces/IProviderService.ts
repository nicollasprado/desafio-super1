export default interface IProviderService {
  id: string
  description: string
  imagesUrls: string[]
  provider: {
    id: string
    firstName: string
    lastName: string
  }
  service: {
    id: string
    name: string
  }
  variants: {
    id: string
    name: string
    price: number
    durationMinutes: number
  }[]
  schedules: {
    id: string
    weekdays: number[]
    start: number
    end: number
  }[]
}
