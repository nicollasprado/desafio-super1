export type TAvailabilityItem = {
  day: number;
  weekDay: string;
  month: string;
  value: Date;
  contractedStarts: Record<string, boolean>;
};

export type TAvailabilityDTO = Record<string, TAvailabilityItem>;
