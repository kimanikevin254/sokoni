import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SendVerificationMailDto } from './dto/send-verification-mail.dto';
import { SendPasswordResetMailDto } from './dto/send-password-reset-mail.dto';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('send_verification_mail')
  sendVerificationMail(@Payload() dto: SendVerificationMailDto) {
    return this.notificationService.sendVerificationMail(dto);
  }

  @EventPattern('send_password_reset_mail')
  sendPasswordResetMail(@Payload() dto: SendPasswordResetMailDto) {
    return this.notificationService.sendPasswordResetMail(dto);
  }
}
