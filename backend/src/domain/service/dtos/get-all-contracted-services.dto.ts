import { Type } from 'class-transformer';
import { IsInt, Min, Max, IsOptional, IsUUID } from 'class-validator';

export class GetAllContractedQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @IsOptional()
  @IsUUID()
  contractorId?: string;

  @IsOptional()
  @IsUUID()
  providerId?: string;
}

export type TGetAllContracted = InstanceType<typeof GetAllContractedQueryDto>;
