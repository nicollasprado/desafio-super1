import { IsISO8601, IsUUID } from 'class-validator';

export class ContractServiceDto {
  @IsUUID() contractorId: string;
  @IsUUID() variantId: string;
  @IsISO8601() date: string;
}

export type TContractServiceDTO = InstanceType<typeof ContractServiceDto>;
