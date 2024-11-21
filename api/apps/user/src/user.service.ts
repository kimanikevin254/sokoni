import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { LogInDto } from './dto/login.dto';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import { LogOutDto } from './dto/logout.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ConfigService } from '@nestjs/config';
import {
  IEmailVerificationTokenRepository,
  IEmailVerificationTokenRepositoryToken,
  IPasswordResetTokenRepository,
  IPasswordResetTokenRepositoryToken,
  IRefreshTokenRepository,
  IRefreshTokenRepositoryToken,
  IUserRepository,
  IUserRepositoryToken,
} from '@app/database';
import { CustomRpcException } from '@app/common-lib/utils/custom-rpc-exception';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientProxy,
    private readonly configService: ConfigService,
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
    @Inject(IRefreshTokenRepositoryToken)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject(IEmailVerificationTokenRepositoryToken)
    private readonly emailVerificationTokenRepository: IEmailVerificationTokenRepository,
    @Inject(IPasswordResetTokenRepositoryToken)
    private readonly passwordResetTokenRepository: IPasswordResetTokenRepository,
  ) {}

  private async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  private async generateTokens(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new CustomRpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'User does not exist',
      });
    }
    const accessToken = await this.jwtService.signAsync(
      { sub: userId },
      { expiresIn: this.configService.get<number>('config.jwt.ttl') * 60 },
    );

    const refreshToken = randomBytes(32).toString('hex');

    // Save the refresh token to db
    const newRefreshToken = this.refreshTokenRepository.create({
      token: refreshToken,
      expiresAt: new Date(
        Date.now() +
          this.configService.get<number>('config.refreshToken.ttl') * 1000,
      ),
      user,
    });

    await this.refreshTokenRepository.save(newRefreshToken);

    return { accessToken, refreshToken };
  }

  findAll() {
    return this.userRepository.findAll();
  }

  async createUser(dto: CreateUserDto) {
    // Make sure email is not registered
    const userExists = await this.userRepository.findByEmail(dto.email);

    if (userExists) {
      throw new CustomRpcException({
        statusCode: 400,
        message: 'This email address is already registered.',
      });
    }

    const hashedPassword = await this.hashPassword(dto.password);

    // Create user
    const userInstance = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      passwordHash: hashedPassword,
    });

    const user = await this.userRepository.save(userInstance);

    // Generate email verification token
    const verificationToken = randomBytes(32).toString('hex');

    // Save email verification token
    const newEmailVerificationToken =
      this.emailVerificationTokenRepository.create({
        token: verificationToken,
        user,
        expiresAt: new Date(
          Date.now() +
            this.configService.get('config.linksTtl.verificationLink') *
              60 *
              1000,
        ),
      });

    await this.emailVerificationTokenRepository.save(newEmailVerificationToken);

    this.notificationClient.emit('send_verification_mail', {
      to: user.email,
      name: user.name,
      verificationToken,
    });

    return {
      message:
        'Click the link sent to the provided email address to verify your account.',
    };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    // Check if token is valid
    const emailVerificationToken =
      await this.emailVerificationTokenRepository.findValidToken(dto.token);

    if (!emailVerificationToken) {
      throw new CustomRpcException({
        message: 'Invalid token',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // Mark user's email as verified
    const user = await this.userRepository.update(
      emailVerificationToken.user.id,
      { emailVerifiedAt: new Date() },
    );

    // Expire the token
    await this.emailVerificationTokenRepository.update(
      emailVerificationToken.id,
      { expiresAt: new Date() },
    );

    // Generate tokens
    const tokens = await this.generateTokens(user.id);

    return {
      tokens,
      userId: user.id,
    };
  }

  async login(dto: LogInDto) {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new CustomRpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Incorrect credentials',
      });
    }

    // Check if password matches
    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new CustomRpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Incorrect credentials',
      });
    }

    // Check if email address has been verified
    if (!user.emailVerifiedAt) {
      throw new CustomRpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'You have not verified your email address',
      });
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id);

    return { tokens, userId: user.id };
  }

  async refreshTokens(dto: RefreshTokensDto) {
    // Check if refresh token exists
    const refreshToken = await this.refreshTokenRepository.findValidToken({
      token: dto.refreshToken,
      userId: dto.userId,
    });

    if (!refreshToken) {
      // Refresh token not found
      throw new CustomRpcException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    }

    // Mark old refresh token as expired
    await this.refreshTokenRepository.update(refreshToken.id, {
      expiresAt: new Date(),
    });

    // Generate tokens
    const tokens = await this.generateTokens(dto.userId);

    return {
      tokens,
      userId: dto.userId,
    };
  }

  async logOut(dto: LogOutDto, userId: string) {
    const refreshToken = await this.refreshTokenRepository.findValidToken({
      token: dto.refreshToken,
      userId,
    });

    if (refreshToken) {
      await this.refreshTokenRepository.update(refreshToken.id, {
        expiresAt: new Date(),
      });
    } else return;
  }

  async changePassword(dto: ChangePasswordDto, userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new CustomRpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    // Check if user password is same as provided old password
    const passwordMatches = await bcrypt.compare(
      dto.oldPassword,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new CustomRpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Passwords do not match',
      });
    }

    const passwordHash = await this.hashPassword(dto.newPassword);

    // Update user password
    await this.userRepository.update(user.id, { passwordHash: passwordHash });

    return {
      message: 'Password updated successfully',
    };
  }

  async forgotPassword(dto: ForgetPasswordDto) {
    // Make sure user exists
    const user = await this.userRepository.findByEmail(dto.email);

    if (user) {
      // Generate a password rest token
      const token = randomBytes(32).toString('hex');

      // Save the password reset token to db
      const passwordResetToken = this.passwordResetTokenRepository.create({
        token,
        user,
        expiresAt: new Date(
          Date.now() +
            parseInt(
              this.configService.get<string>(
                'config.linksTtl.passwordResetLink',
              ),
            ) *
              60 *
              1000,
        ),
      });

      await this.passwordResetTokenRepository.save(passwordResetToken);

      // Send email
      this.notificationClient.emit('send_password_reset_mail', {
        to: user.email,
        name: user.name,
        token,
      });
    }

    return {
      message:
        'If this email address is registered, you will receive a password reset link.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    // Check if token exists
    const passwordResetToken =
      await this.passwordResetTokenRepository.findValidToken(dto.token);

    if (!passwordResetToken) {
      throw new CustomRpcException({
        message: 'Invalid password reset token',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // Reset user's password
    const hashedPassword = await this.hashPassword(dto.password);

    // Update user's password
    await this.userRepository.update(passwordResetToken.user.id, {
      passwordHash: hashedPassword,
    });

    // Invalidate the token
    await this.passwordResetTokenRepository.update(passwordResetToken.id, {
      expiresAt: new Date(),
    });

    return {
      message:
        'Password reset successfully. You can now log in with your new credentials',
    };
  }

  async profile(userId: string) {
    const user = await this.userRepository.findById(userId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...rest } = user;
    return rest;
  }
}
