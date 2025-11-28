import { IsDateString, IsUUID } from 'class-validator';

export class ContractServiceBodyDto {
  @IsUUID() contractorId: string;
  @IsDateString()
  start: string;
}

export type TContractServiceDTO = InstanceType<
  typeof ContractServiceBodyDto
> & { variantId: string };
