/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const newUser = this.userRepository.create({
      login: createUserDto.login,
      password: createUserDto.password,
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

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('oldPassword is wrong');
    }

    user.password = updatePasswordDto.newPassword;
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
