import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'; // <-- Token üretimi için

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService, // <-- Enjekte edildi
  ) { }

  // 1. KAYIT OLMA (REGISTER)
  async register(registerDto: any) {
    const existingUser = await this.usersService.findOneByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Bu email adresi zaten kullanımda!');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // UsersService'e göndermeden önce şifreyi değiştirelim
    return this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });
  }

  // 2. KULLANICI DOĞRULAMA (LOGIN İÇİN GEREKLİ)
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      return null; // Kullanıcı yok
    }

    // Girilen şifre ile veritabanındaki hashlenmiş şifreyi karşılaştır
    const isPasswordMatching = await bcrypt.compare(pass, user.password);

    if (isPasswordMatching) {
      // Şifre doğruysa şifreyi döndürmeden kullanıcı bilgisini döndür
      const { password, ...result } = user;
      return result;
    }
    return null; // Şifre yanlış
  }

  // 3. GİRİŞ YAPMA VE TOKEN ÜRETME
  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };

    // JWT Token oluşturma
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}