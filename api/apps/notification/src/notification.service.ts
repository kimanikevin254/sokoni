import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { EmailTemplateService } from './email-template.service';
import { SendVerificationMailDto } from './dto/send-verification-mail.dto';

@Injectable()
export class NotificationService {
  private mailgunClient;

  private MAILGUN_KEY: string;
  private MAILGUN_DOMAIN: string;
  private MAIL_FROM: string;
  private APP_NAME: string;

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
    this.APP_NAME = this.configService.get<string>('config.app.name');

    // Initialize Mailgun client
    const mailgun = new Mailgun(FormData);
    this.mailgunClient = mailgun.client({
      username: 'api',
      key: this.MAILGUN_KEY,
    });
  }

  async sendVerificationMail(dto: SendVerificationMailDto) {
    const htmlContent =
      await this.emailTemplateService.verificationEmailTemplate(
        dto.name.split(' ')[0],
        dto.verificationLink,
      );

    return await this.mailgunClient.messages.create(this.MAILGUN_DOMAIN, {
      from: this.MAIL_FROM,
      to: dto.to,
      subject: 'Email Verification',
      html: htmlContent,
    });
  }

  async sendPasswordResetMail(to: string, name: string, resetLink: string) {
    const htmlContent = await this.emailTemplateService.passwordResetTemplate(
      name.split(' ')[0],
      resetLink,
    );

    return await this.mailgunClient.messages.create(this.MAILGUN_DOMAIN, {
      from: this.MAIL_FROM,
      to,
      subject: 'Password Reset Request',
      html: htmlContent,
    });
  }
}
