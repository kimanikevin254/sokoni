import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigurationModule } from '@app/configuration';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [],
  exports: [],
  imports: [
    ConfigurationModule,
    JwtModule.registerAsync({
      imports: [ConfigurationModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('config.jwt.secret'),
          global: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AuthenticationModule {}
