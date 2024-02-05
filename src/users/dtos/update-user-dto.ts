import { IsArray, IsDateString, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsArray()
  subscriptions: string[];

  @IsDateString()
  time: string;

  @IsString()
  timeZone: string;
}
