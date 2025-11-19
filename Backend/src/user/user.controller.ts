import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('list')
    @UseGuards(JwtAuthGuard)
    async getAllUsersExceptSelf(@Req() req) {
        const userId = req.user.id;
        return this.userService.getAllUsersExceptSelf(userId);
    }
}
