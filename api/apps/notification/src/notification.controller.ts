import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SendVerificationMailDto } from './dto/send-verification-mail.dto';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern({ cmd: 'send-verification-mail' })
  sendVerificationMail(@Payload() dto: SendVerificationMailDto) {
    console.log(dto);
    // return this.notificationService.sendVerificationMail(dto);
  }
}
