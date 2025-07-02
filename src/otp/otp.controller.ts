import { CreateOTPDto } from '@/otp/dto/create-otp.dto';
import { ValidateOTPDto } from '@/otp/dto/validate-otp.dto';
import { OtpService } from '@/otp/otp.service';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {
  }

  @Post('create')
  @ApiOperation({
    summary: 'Register OTP',
    description: 'Register OTP for a user',
  })
  async otp(@Body() body: CreateOTPDto): Promise<CreateOTPDto & {message: string, trackingURL: string}> {
    const trackingURL = await this.otpService.createOTP(body);
    if (trackingURL) {
      return {
        ...body,
        message: 'OTP created successfully. Please check your email.',
        trackingURL,
      }
    }
    throw new BadRequestException("Failed to create OTP. Please try again.");
  }

  @Post('validate')
  @ApiOperation({
    summary: 'Validate OTP',
    description: 'Validate OTP for a user',
  })
  async validateOtp(
    @Body() body: ValidateOTPDto,
  ): Promise<ValidateOTPDto & {message: string}> {
    const isValid = await this.otpService.validateOTP(body.email, body.otp);
    if (isValid) {
      return {
        message: 'OTP is valid. You can proceed with the next steps.',
        ...body
      }
    }
    throw new BadRequestException("Invalid or expires OTP. Please try again.")
  }
}
