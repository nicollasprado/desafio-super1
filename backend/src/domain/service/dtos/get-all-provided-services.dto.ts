import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max, IsUUID, IsString } from 'class-validator';

export class GetAllProvidedQueryDto {
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
  serviceId?: string;

  @IsOptional()
  @IsString()
  search?: string;
}

export type TGetAllProvided = InstanceType<typeof GetAllProvidedQueryDto>;
