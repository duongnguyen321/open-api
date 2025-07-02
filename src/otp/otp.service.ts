import generateOtp from '@/common/helpers/generateOTP';
import { MailService } from '@/mail/mail.service';
import { CreateOTPDto } from '@/otp/dto/create-otp.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { RedisService } from '@/redis/redis.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailType } from '@prisma/client';

@Injectable()
export class OtpService {
  constructor(
    private readonly prisma: PrismaService,
    private configService: ConfigService,
    private redis: RedisService,
    private readonly mailService: MailService,
  ) {
  }

  async getOTP(email: string): Promise<string | null> {
    if (!email) {
      throw new Error('Email is required');
    }
    const otp = this.redis.get(`OTP-${email}`);
    if (otp) {
      return otp;
    }
    return null;
  }

  async validateOTP(email: string, otp: string): Promise<boolean> {
    if (!email || !otp) {
      throw new Error('Email and OTP are required');
    }
    const storedOtp = await this.getOTP(email);
    if (!storedOtp) {
      return false; // OTP not found or expired
    }
    const isValid = storedOtp === otp;
    if (isValid) {
      await this.redis.del(`OTP-${email}`); // Invalidate OTP after successful validation
    }
    return isValid;
  }

  async createOTP(body: CreateOTPDto): Promise<string> {
    const { email, name, validityPeriod = '5 mins' } = body;
    if (!email || !name) {
      throw new Error('Email and name are required');
    }
    const existingOtp = await this.getOTP(email);
    const otp = existingOtp || generateOtp();
    await this.redis.set(`OTP-${email}`, otp, validityPeriod);
    const subject = `Your One-Time Password, ${name}`;
    const template = 'send-otp';
    return this.mailService.sendMail(email, MailType.OTP, {
      subject,
      template,
      context: { ...body, otp },
    });

  }
}
