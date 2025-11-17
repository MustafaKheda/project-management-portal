import { IsEmail, IsString } from "class-validator";

export class RegisterDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  client_id: string;
  role?: string; // optional: admin / member
}