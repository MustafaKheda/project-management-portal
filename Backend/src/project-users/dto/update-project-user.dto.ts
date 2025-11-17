import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateProjectUserRoleDto {
  @IsEnum(['owner', 'developer', 'viewer'])
  @IsNotEmpty()
  role: 'owner' | 'developer' | 'viewer';
}