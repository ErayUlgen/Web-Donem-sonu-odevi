import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Token'ı "Bearer ..." başlığından al
      ignoreExpiration: false, // Süresi dolmuş token'ı reddet
      secretOrKey: process.env.JWT_SECRET || 'Alierdemusta45', // AuthModule'deki şifrenin AYNISI olmalı!
    });
  }

  async validate(payload: any) {
    // Token geçerliyse içindeki bilgileri (id, email) geri döndür
    return { userId: payload.sub, email: payload.email };
  }
}