import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { LogInDto } from './dto/login.dto';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import { LogOutDto } from './dto/logout.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
    private jwtService: JwtService,
  ) {}

  private async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  private async generateTokens(userId: string) {
    const user = await this.findUserById(userId);

    if (!user) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'User does not exist',
      });
    }
    const accessToken = await this.jwtService.signAsync(
      { sub: userId },
      { expiresIn: '6h' },
    );

    const refreshToken = randomBytes(32).toString('hex');

    // Save the refresh token to db
    const newRefreshToken = this.refreshTokenRepository.create({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userId: user,
    });

    await this.refreshTokenRepository.save(newRefreshToken);

    return { accessToken, refreshToken };
  }

  findAll() {
    return this.userRepository.find();
  }

  findUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email: email },
    });
  }

  findUserById(userId: string) {
    return this.userRepository.findOne({
      where: { id: userId },
    });
  }

  async createUser(dto: CreateUserDto) {
    // Make sure email is not registered
    const userExists = await this.findUserByEmail(dto.email);

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

    // Generate tokens
    const tokens = await this.generateTokens(user.id);

    return { tokens, userId: user.id };
  }

  async login(dto: LogInDto) {
    const user = await this.findUserByEmail(dto.email);

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
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: {
        token: dto.refreshToken,
        userId: { id: dto.userId },
        expiresAt: MoreThanOrEqual(new Date()), // Check that expiresAt is greater than or equal to the current date
      },
    });

    if (!refreshToken) {
      // Refresh token not found
      throw new RpcException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    }

    // Mark old refresh token as expired
    await this.refreshTokenRepository.update(
      { token: dto.refreshToken },
      { expiresAt: new Date() },
    );

    // Generate tokens
    const tokens = await this.generateTokens(dto.userId);

    return {
      tokens,
      userId: dto.userId,
    };
  }

  async logOut(dto: LogOutDto) {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token: dto.refreshToken },
    });

    if (refreshToken) {
      await this.refreshTokenRepository.update(
        { token: refreshToken.token },
        { expiresAt: new Date() },
      );
    } else return;
  }

  async changePassword(dto: ChangePasswordDto, userId: string) {
    const user = await this.findUserById(userId);

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
    await this.userRepository.update(
      { id: user.id },
      { passwordHash: passwordHash },
    );

    return {
      message: 'Password updated successfully',
    };
  }
}
