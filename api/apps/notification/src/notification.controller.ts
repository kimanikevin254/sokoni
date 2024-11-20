import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SendVerificationMailDto } from './dto/send-verification-mail.dto';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('send_verification_mail')
  sendVerificationMail(@Payload() dto: SendVerificationMailDto) {
    return this.notificationService.sendVerificationMail(dto);
  }
}
