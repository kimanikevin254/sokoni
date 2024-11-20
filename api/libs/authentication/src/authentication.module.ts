import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigurationModule } from '@app/configuration';

@Module({
  providers: [],
  exports: [],
  imports: [
    ConfigurationModule,
    // JwtModule.registerAsync({
    //   imports: [ConfigurationModule],
    //   useFactory: (configService: ConfigService) => {
    //     return {
    //       secret: configService.get<string>('config.jwt.secret'),
    //       global: true,
    //     };
    //   },
    //   inject: [ConfigService],
    // }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
    }),
  ],
})
export class AuthenticationModule {}
