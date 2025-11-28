import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class VariantDto {
  @IsString() name: string;
  @IsInt() @Min(0) price: number;
  @IsInt() @Min(1) durationMinutes: number;
}

class ScheduleDto {
  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(6)
  weekday: number;
  @IsDateString()
  start: string;
  @IsDateString()
  end: string;
}

export class ProvideServiceDto {
  @IsString() description: string;
  @IsUUID() providerId: string;
  @IsUUID() serviceId: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  variants: VariantDto[];
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  schedules: ScheduleDto[];
}

export type TProvideServiceDTO = InstanceType<typeof ProvideServiceDto>;
