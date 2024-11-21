import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { LogInDto } from './dto/login.dto';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import { LogOutDto } from './dto/logout.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ConfigService } from '@nestjs/config';
import {
  EmailVerificationTokenEntity,
  IRefreshTokenRepository,
  IRefreshTokenRepositoryToken,
  IUserRepository,
  IUserRepositoryToken,
} from '@app/database';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(EmailVerificationTokenEntity)
    private readonly emailVerificationTokenRepository: Repository<EmailVerificationTokenEntity>,
    private jwtService: JwtService,
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientProxy,
    private readonly configService: ConfigService,
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
    @Inject(IRefreshTokenRepositoryToken)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  private async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  private async generateTokens(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new RpcException({
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
      throw new RpcException({
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
        user: { id: user.id },
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      });

    await this.emailVerificationTokenRepository.save(newEmailVerificationToken);

    this.notificationClient.emit('send_verification_mail', {
      to: user.email,
      name: user.name,
      verificationToken,
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id);

    return { tokens, userId: user.id };
  }

  async login(dto: LogInDto) {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new RpcException({
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
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Incorrect credentials',
      });
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id);

    return { tokens, userId: user.id };
  }

  async refreshTokens(dto: RefreshTokensDto) {
    // Check if refresh token exists
    const refreshToken = await this.refreshTokenRepository.findToken({
      token: dto.refreshToken,
      userId: dto.userId,
      expiresAt: new Date(), // Check that expiresAt is greater than or equal to the current date
    });

    if (!refreshToken) {
      // Refresh token not found
      throw new RpcException({
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
    const refreshToken = await this.refreshTokenRepository.findToken({
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
      throw new RpcException({
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
      throw new RpcException({
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

  async profile(userId: string) {
    const user = await this.userRepository.findById(userId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...rest } = user;
    return rest;
  }
}
