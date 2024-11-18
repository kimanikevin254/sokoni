import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { ConfigurationModule } from '@app/configuration';
import { DatabaseModule } from '@app/database';
import { EmailTemplateService } from './email-template.service';

@Module({
  imports: [ConfigurationModule, DatabaseModule],
  controllers: [NotificationController],
  providers: [NotificationService, EmailTemplateService],
})
export class NotificationModule {}
