import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsISO8601,
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
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  weekdays: number[];
  @IsISO8601() start: string;
  @IsISO8601() end: string;
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
