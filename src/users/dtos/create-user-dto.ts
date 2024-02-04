import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsArray()
  @IsNotEmpty()
  subscriptions: string[];

  @IsDateString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  timeZone: string;
}
