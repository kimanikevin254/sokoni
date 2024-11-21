import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { EmailTemplateService } from './email-template.service';
import { SendVerificationMailDto } from './dto/send-verification-mail.dto';
import { CustomRpcException } from '@app/common-lib/utils/custom-rpc-exception';
import { SendPasswordResetMailDto } from './dto/send-password-reset-mail.dto';

@Injectable()
export class NotificationService {
  private mailgunClient;

  private MAILGUN_KEY: string;
  private MAILGUN_DOMAIN: string;
  private MAIL_FROM: string;

  constructor(
    private configService: ConfigService,
    private emailTemplateService: EmailTemplateService,
  ) {
    // Initialize environment variables in constructor
    this.MAILGUN_KEY = this.configService.get<string>('config.mail.mailgunKey');
    this.MAILGUN_DOMAIN = this.configService.get<string>(
      'config.mail.mailgunDomain',
    );
    this.MAIL_FROM = this.configService.get<string>('config.mail.from');

    // Initialize Mailgun client
    const mailgun = new Mailgun(FormData);
    this.mailgunClient = mailgun.client({
      username: 'api',
      key: this.MAILGUN_KEY,
    });
  }

  async sendVerificationMail(dto: SendVerificationMailDto) {
    try {
      const verificationLink = `${this.configService.get<string>('config.frontend.emailVerificationLink')}?token=${dto.verificationToken}`;

      const htmlContent =
        await this.emailTemplateService.verificationEmailTemplate(
          dto.name.split(' ')[0],
          verificationLink,
        );

      return await this.mailgunClient.messages.create(this.MAILGUN_DOMAIN, {
        from: this.MAIL_FROM,
        to: dto.to,
        subject: 'Email Verification',
        html: htmlContent,
      });
    } catch (error) {
      throw new CustomRpcException({
        message: error,
        statusCode: 500,
      });
    }
  }

  async sendPasswordResetMail(dto: SendPasswordResetMailDto) {
    try {
      const resetLink = `${this.configService.get<string>('config.frontend.passwordResetLink')}?token=${dto.token}`;

      const htmlContent = await this.emailTemplateService.passwordResetTemplate(
        dto.name.split(' ')[0],
        resetLink,
      );

      return await this.mailgunClient.messages.create(this.MAILGUN_DOMAIN, {
        from: this.MAIL_FROM,
        to: dto.to,
        subject: 'Password Reset Request',
        html: htmlContent,
      });
    } catch (error) {
      throw new CustomRpcException({
        message: error,
        statusCode: 500,
      });
    }
  }
}
