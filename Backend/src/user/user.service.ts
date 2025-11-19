import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }
    async getAllUsersExceptSelf(currentUserId: string) {
        return this.userRepo.find({
            where: {
                id: Not(currentUserId),
                role: Not('admin'),
            },
            select: ['id', 'email'], // optional
        });
    }
}
