export type TAvailabilityItem = {
  day: number;
  weekDay: string;
  month: string;
  date: string;
  contractedStarts: Record<string, boolean>;
};

export type TAvailabilityDTO = Record<string, TAvailabilityItem>;
