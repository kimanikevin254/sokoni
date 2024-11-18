import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailTemplateService {
  private APP_NAME: string;
  private EMAIL_VERIFICATION_LINK_TTL: string;
  private PASSWORD_RESET_LINK_TTL: string;

  constructor(private configService: ConfigService) {
    this.APP_NAME = this.configService.get<string>('config.app.name');
    this.EMAIL_VERIFICATION_LINK_TTL = this.configService.get<string>(
      'config.linksTtl.verificationLink',
    );
    this.PASSWORD_RESET_LINK_TTL = this.configService.get<string>(
      'config.linksTtl.passwordResetLink',
    );
  }

  private filePath(fileName: string) {
    return path.join(
      process.cwd(),
      'apps/notification/src/templates/mail',
      fileName,
    );
  }

  async verificationEmailTemplate(name: string, verificationLink: string) {
    // Read the EJS file content
    const templateContent = fs.readFileSync(
      this.filePath('verification-email.ejs'),
      'utf8',
    );

    // Render the template with dynamic values
    return ejs.render(templateContent, {
      name,
      verificationLink,
      appName: this.APP_NAME,
      linkTtl: this.EMAIL_VERIFICATION_LINK_TTL,
    });
  }

  async passwordResetTemplate(name: string, resetLink: string) {
    // Read the EJS file content
    const templateContent = fs.readFileSync(
      this.filePath('password-reset-email.ejs'),
      'utf8',
    );

    // Render the template with dynamic values
    return ejs.render(templateContent, {
      name,
      resetLink,
      appName: this.APP_NAME,
      linkTtl: this.PASSWORD_RESET_LINK_TTL,
    });
  }
}
