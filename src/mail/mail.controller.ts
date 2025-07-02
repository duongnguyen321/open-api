import { ApiResponseDto } from '@/common/classes/response.dto';
import { ApiMessageKey } from '@/common/constants/message.constants';
import { BasicHeader } from '@/common/decorators/basic-header.decorator';
import { FilterEmailDto } from '@/mail/dto/filter-email.dto';
import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import type { MailTracking } from '@prisma/client';
import type { Response } from 'express';
import { MailService } from './mail.service';

@BasicHeader('Mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('tracking')
  @ApiOperation({
    summary: 'String buffer of image',
  })
  @ApiOkResponse({ type: File })
  @ApiOperation({ summary: 'Get Image' })
  async getImage(
    @Query('email') email: string,
    @Query('id') id: string,
    @Res() res: Response,
  ) {
    try {
      const bufferLikeBuffer = await this.mailService.trackingMail({
        email,
        id,
      });
      res.setHeader('Content-Type', 'image/png');
      res.send(bufferLikeBuffer);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Get()
  @ApiOperation({
    summary: 'List email sent',
  })
  @ApiOkResponse({ type: File })
  @ApiOperation({ summary: 'Get Image' })
  async getListEmail(
    @Query() filterDto: FilterEmailDto,
  ): Promise<ApiResponseDto<MailTracking[]>> {
    try {
      const where: Partial<MailTracking> = {
        recipient: filterDto?.email || undefined,
        type: filterDto?.type || undefined,
        status: filterDto?.status || undefined,
      };
      const take = filterDto.limit;
      const skip = (filterDto.page - 1) * take;
      const mailSent = await this.mailService.getAllMail({
        take,
        skip,
        where,
        orderBy: {
          createdAt: 'desc',
        },
      });
      return new ApiResponseDto<MailTracking[]>({
        statusCode: HttpStatus.OK,
        data: mailSent.mails,
        message: ApiMessageKey.GET_ALL_EMAILS,
        pagination: {
          page: filterDto.page,
          limit: filterDto.limit,
          total: mailSent.total,
        },
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
