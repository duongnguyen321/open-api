import { IsOptional, IsString, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FilterCityDto {
  @ApiProperty({
    description: 'Filter by city name',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Filter by state ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  stateId?: string;

  @ApiProperty({
    description: 'Search term across multiple fields',
    required: false,
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({
    description: 'Page number (0-indexed)',
    required: false,
    default: 0,
    type: Number
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value) || 0)
  @IsInt()
  page?: number = 0;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 10,
    type: Number
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value) || 10)
  @IsInt()
  limit?: number = 10;
}
