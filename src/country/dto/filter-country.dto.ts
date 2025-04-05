import { IsOptional, IsString, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FilterCountryDto {
  @ApiProperty({
    description: 'Filter by country name',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Filter by ISO3 code',
    required: false,
  })
  @IsOptional()
  @IsString()
  iso3?: string;

  @ApiProperty({
    description: 'Filter by ISO2 code',
    required: false,
  })
  @IsOptional()
  @IsString()
  iso2?: string;

  @ApiProperty({
    description: 'Filter by currency',
    required: false,
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    description: 'Filter by capital city',
    required: false,
  })
  @IsOptional()
  @IsString()
  capital?: string;

  @ApiProperty({
    description: 'Filter by region',
    required: false,
  })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiProperty({
    description: 'Filter by subregion',
    required: false,
  })
  @IsOptional()
  @IsString()
  subregion?: string;

  @ApiProperty({
    description: 'Filter by nationality',
    required: false,
  })
  @IsOptional()
  @IsString()
  nationality?: string;

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
