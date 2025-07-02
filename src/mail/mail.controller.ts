import { BasicHeader } from '@/common/decorators/basic-header.decorator';
import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';
import { MailService } from './mail.service';

@BasicHeader('Mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {
  }

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
      const bufferLikeBuffer = await this.mailService.trackingMail({ email, id });
      res.setHeader('Content-Type', 'image/png');
      res.send(bufferLikeBuffer);
    } catch (err) {
      throw err;
    }
  }
}
