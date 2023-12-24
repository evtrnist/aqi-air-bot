import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { AirQService } from './air-q.service';
import { PrismaModule } from 'prisma/prisma.module';
import { StartModule } from './start/start.module';
import { session } from 'telegraf';
import { UsersModule } from './users/users.module';
import { ApiModule } from './api/api.module';

export const sessionMiddleware = session();

@Module({
  imports: [
    HttpModule,
    PrismaModule,
    ScheduleModule.forRoot(),
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN,
      middlewares: [sessionMiddleware],
    }),
    StartModule,
    UsersModule,
    ApiModule,
  ],
  providers: [AppService, AirQService],
})
export class AppModule {}
