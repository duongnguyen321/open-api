import { ApiProperty } from '@nestjs/swagger';
import { MailStatus, MailType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class FilterEmailDto {
  @ApiProperty({
    description: 'Filter by email',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  @IsString()
  email?: string;

  @ApiProperty({
    description: 'Filter by type of email',
    required: false,
  })
  @IsOptional()
  @IsEnum(MailType)
  type?: MailType;

  @ApiProperty({
    description: 'Filter by type of status',
    required: false,
  })
  @IsOptional()
  @IsEnum(MailStatus)
  status?: MailStatus;

  @ApiProperty({
    description: 'Page number (1-indexed)',
    required: false,
    default: 1,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value) || 1)
  @IsInt()
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 10,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value) || 10)
  @IsInt()
  limit?: number = 10;
}
