import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepo: Repository<Client>,
  ) {}

  create(dto: CreateClientDto) {
    const client = this.clientRepo.create(dto);
    console.log('Creating client:', client);
    return this.clientRepo.save(client);
  }

  findAll() {
    return this.clientRepo.find();
  }

  findOne(id: string) {
    return this.clientRepo.findOne({ where: { id } });
  }
}
