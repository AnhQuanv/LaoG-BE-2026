import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { Role } from '../../modules/role/entities/role.entity';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}
  async register(registerDto: RegisterDto) {
    const { email, password, fullName, phone, address } = registerDto;

    // 1. Kiểm tra Email tồn tại
    const isEmailExist = await this.userRepository.findOne({
      where: { email },
    });
    if (isEmailExist) {
      throw new BadRequestException('Email này đã được sử dụng!');
    }

    const userRole = await this.roleRepository.findOne({
      where: { name: 'USER' },
    });
    if (!userRole) {
      throw new InternalServerErrorException(
        'Lỗi hệ thống: Role mặc định không tồn tại!',
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      fullName,
      phone,
      address,
      role: userRole,
      isActive: true,
    });

    try {
      const savedUser = await this.userRepository.save(newUser);

      // Trả về dữ liệu sạch (không bao gồm password)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = savedUser;
      return result;
    } catch {
      throw new InternalServerErrorException('Lỗi hệ thống khi tạo tài khoản!');
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
