import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Client } from '../clients/client.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,

    private readonly jwtService: JwtService,
  ) { }

  // ===========================
  // REGISTER USER
  // ===========================
  async register(dto: RegisterDto) {
    console.log(dto)
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException('Email already registered');
    }
    const client = await this.clientRepo.findOne({ where: { id: dto.client_id } });

    if (!client) {
      throw new NotFoundException('Client company not found');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      email: dto.email,
      password_hash: hashed,
      role: dto.role || 'member',
      client: client,
    });

    await this.userRepo.save(user);

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        client_id: client.id,
      },
    };
  }

  // ===========================
  // LOGIN USER
  // ===========================
  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      relations: ['client'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      clientId: user.client.id,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      token,
    };
  }

  // ===========================
  // GET CURRENT USER FROM JWT
  // ===========================
  async getMe(user: any) {
    const found = await this.userRepo.findOne({
      where: { id: user.id },
      relations: ['client'],
    });

    if (!found) throw new UnauthorizedException();

    return {
      id: found.id,
      email: found.email,
      role: found.role,
      clientId: found.client.id,
    };
  }
}
