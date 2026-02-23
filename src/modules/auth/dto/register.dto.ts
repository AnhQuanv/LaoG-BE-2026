import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'user@laog.com',
    description: 'Địa chỉ email dùng để đăng nhập',
    format: 'email',
    required: true,
  })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email!: string;

  @ApiProperty({
    type: 'string',
    example: '123456',
    format: 'password',
    description: 'Mật khẩu phải có ít nhất 6 ký tự',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu quá ngắn, tối thiểu 6 ký tự' })
  password!: string;

  @ApiProperty({
    example: 'Nguyen Van A',
    description: 'Tên đầy đủ của người dùng',
  })
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @IsString()
  fullName!: string;

  @ApiProperty({
    example: '0123456789',
    description: 'Số điện thoại của người dùng',
  })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsString()
  phone!: string;

  @ApiProperty({
    example: 'ABC Street, XYZ City',
    description: 'Địa chỉ của người dùng',
  })
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  @IsString()
  address!: string;
}
