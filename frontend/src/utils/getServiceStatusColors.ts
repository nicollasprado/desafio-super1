import type { TServiceStatus } from '$lib/types/TServiceStatus'

const getServiceStatusColors = (status: TServiceStatus): { bgColor: string; textColor: string } => {
  const finalStatus = status.toUpperCase()

  switch (finalStatus) {
    case 'PAYMENT_PENDING':
      return { bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' }
    case 'WAITING_CONFIRMATION':
      return { bgColor: 'bg-blue-100', textColor: 'text-blue-800' }
    case 'SCHEDULED':
      return { bgColor: 'bg-purple-100', textColor: 'text-purple-800' }
    case 'ONGOING':
      return { bgColor: 'bg-indigo-100', textColor: 'text-indigo-800' }
    case 'FINISHED':
      return { bgColor: 'bg-green-100', textColor: 'text-green-800' }
    case 'CANCELED':
      return { bgColor: 'bg-red-100', textColor: 'text-red-800' }
    case 'REJECTED':
      return { bgColor: 'bg-red-100', textColor: 'text-red-800' }
    default:
      return { bgColor: 'bg-gray-100', textColor: 'text-gray-800' }
  }
}

export default getServiceStatusColors
