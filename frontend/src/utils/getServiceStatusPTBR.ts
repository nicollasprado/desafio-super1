import type { TServiceStatus } from '$lib/types/TServiceStatus'

const getServiceStatusPTBR = (status: TServiceStatus): string => {
  const finalStatus = status.toUpperCase()

  switch (finalStatus) {
    case 'PAYMENT_PENDING':
      return 'Pagamento Pendente'
    case 'WAITING_CONFIRMATION':
      return 'Esperando Confirmação'
    case 'SCHEDULED':
      return 'Agendado'
    case 'ONGOING':
      return 'Em Andamento'
    case 'FINISHED':
      return 'Concluído'
    case 'CANCELED':
      return 'Cancelado'
    case 'REJECTED':
      return 'Rejeitado'
    default:
      return '-'
  }
}

export default getServiceStatusPTBR
