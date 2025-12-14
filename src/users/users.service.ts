/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { validate as uuidValidate } from 'uuid';

type UserResponse = Pick<
  User,
  'id' | 'login' | 'version' | 'createdAt' | 'updatedAt'
>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<UserResponse[]> {
    const users = await this.userRepository.find();
    return users.map(
      ({
        password,
        setTimestampsOnInsert,
        setTimestampsOnUpdate,
        ...user
      }) => ({
        ...user,
        createdAt: Number(user.createdAt),
        updatedAt: Number(user.updatedAt),
      }),
    );
  }

  async findOne(id: string): Promise<UserResponse> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('userId is invalid (not uuid)');
    }

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const {
      password,
      setTimestampsOnInsert,
      setTimestampsOnUpdate,
      ...userWithoutPassword
    } = user;
    return {
      ...userWithoutPassword,
      createdAt: Number(userWithoutPassword.createdAt),
      updatedAt: Number(userWithoutPassword.updatedAt),
    };
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    // Hash password before saving
    const saltRounds = parseInt(process.env.CRYPT_SALT || '10', 10);
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    const newUser = this.userRepository.create({
      login: createUserDto.login,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);
    const {
      password,
      setTimestampsOnInsert,
      setTimestampsOnUpdate,
      ...userWithoutPassword
    } = savedUser;
    return userWithoutPassword;
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponse> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('userId is invalid (not uuid)');
    }

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Compare hashed password
    const isOldPasswordValid = await bcrypt.compare(
      updatePasswordDto.oldPassword,
      user.password,
    );
    if (!isOldPasswordValid) {
      throw new ForbiddenException('oldPassword is wrong');
    }

    // Hash new password
    const saltRounds = parseInt(process.env.CRYPT_SALT || '10', 10);
    const hashedNewPassword = await bcrypt.hash(
      updatePasswordDto.newPassword,
      saltRounds,
    );

    user.password = hashedNewPassword;
    const updatedUser = await this.userRepository.save(user);

    const {
      password,
      setTimestampsOnInsert,
      setTimestampsOnUpdate,
      ...userWithoutPassword
    } = updatedUser;
    return userWithoutPassword;
  }

  async remove(id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('userId is invalid (not uuid)');
    }

    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
