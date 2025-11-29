import { TPagination } from 'src/shared/types/TPagination';

export interface IIndexProviderServiceDTO {
  id: string;
  description: string;
  imagesUrls: string[];
  variants: {
    id: string;
    name: string;
    price: number;
    durationMinutes: number;
  }[];
  schedules: {
    id: string;
    weekday: number;
    start: Date;
    end: Date;
  }[];
  service: {
    id: string;
    name: string;
  };
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
}

export interface IProviderServiceSearchResDTO {
  data: IIndexProviderServiceDTO[];
  pagination: TPagination;
}
