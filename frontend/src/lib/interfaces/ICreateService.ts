export interface ICreateServiceSchedule {
  weekday: number
  start: Date
  end: Date
  startStr: string
  endStr: string
}

export interface ICreateServiceVariant {
  name: string
  price: number
  durationMinutes: number
}
