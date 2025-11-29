import { TPagination } from 'src/shared/types/TPagination';
import { TServiceStatus } from 'src/shared/types/TServiceStatus';

export default interface IIndexContractedServiceDTO {
  id: string;
  start: Date;
  end: Date;
  status: TServiceStatus;
  totalPrice: number;
  variant: {
    id: string;
    name: string;
    price: number;
    durationMinutes: number;
    providerService: {
      id: string;
      description: string;
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
    };
  };
  contractor: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
}

export interface IContractedServiceSearchResDTO {
  data: IIndexContractedServiceDTO[];
  pagination: TPagination;
}
