import { ApiResponseDto } from '@/common/classes/response.dto';
import { ErrorCode } from '@/common/constants/error.constants';
import { ApiMessageKey } from '@/common/constants/message.constants';
import { getErrorMessage } from '@/common/utils/message.utils';
import { CreateOTPDto } from '@/otp/dto/create-otp.dto';
import { ValidateOTPDto } from '@/otp/dto/validate-otp.dto';
import { OtpService } from '@/otp/otp.service';
import { BadRequestException, Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

type CreateOTPResponse = CreateOTPDto

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {
  }

  @Post('create')
  @ApiOperation({
    summary: 'Register OTP',
    description: 'Register OTP for a user',
  })
  async otp(@Body() body: CreateOTPDto): Promise<ApiResponseDto<CreateOTPResponse>> {
    const trackingURL = await this.otpService.createOTP(body);
    if (!trackingURL) {
      throw new BadRequestException(getErrorMessage(ErrorCode.CREATE_OTP_FAILED));
    }
    return new ApiResponseDto<CreateOTPResponse>({
      statusCode: HttpStatus.OK,
      data: body,
      message: ApiMessageKey.OTP_CREATED,
      pagination: null,
    });
  }

  @Post('validate')
  @ApiOperation({
    summary: 'Validate OTP',
    description: 'Validate OTP for a user',
  })
  async validateOtp(
    @Body() body: ValidateOTPDto,
  ): Promise<ApiResponseDto<CreateOTPResponse>> {
    const isValid = await this.otpService.validateOTP(body.email, body.otp);
    if (!isValid) {
      throw new BadRequestException(getErrorMessage(ErrorCode.INVALID_OTP));
    }
    return new ApiResponseDto<CreateOTPResponse>({
      statusCode: HttpStatus.OK,
      data: body,
      message: ApiMessageKey.OTP_VERIFIED,
      pagination: null,
    });
  }
}
