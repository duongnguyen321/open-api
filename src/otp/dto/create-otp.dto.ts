import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOTPDto {
  @ApiProperty({
    description: 'Name',
    example: 'John Wick',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email',
    example: 'johnwick@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Validity Period, default is 5 minutes',
    example: '5 mins',
  })
  @IsOptional()
  @IsString()
  validityPeriod: string;

  constructor(partial: Partial<CreateOTPDto>) {
    Object.assign(this, partial);
    this.validityPeriod = this.validityPeriod || '5 mins';
  }
}
