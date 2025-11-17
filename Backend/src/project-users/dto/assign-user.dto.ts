import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export class AssignUserDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsEnum(['owner', 'developer', 'viewer'])
  role: 'owner' | 'developer' | 'viewer';
}