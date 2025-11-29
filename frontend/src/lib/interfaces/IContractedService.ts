import type { TServiceStatus } from '$lib/types/TServiceStatus'

export default interface IContractedService {
  id: string
  start: Date
  end: Date
  status: TServiceStatus
  totalPrice: number
  variant: {
    id: string
    name: string
    price: number
    durationMinutes: number
    providerService: {
      id: string
      description: string
      service: {
        id: string
        name: string
      }
      provider: {
        id: string
        firstName: string
        lastName: string
        avatarUrl?: string
      }
    }
  }
}
