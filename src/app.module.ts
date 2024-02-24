import { Module } from '@nestjs/common';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { AirQService } from './air-q.service';
import { PrismaModule } from 'prisma/prisma.module';
import { session } from 'telegraf';
import { UsersModule } from './users/users.module';
import { ApiModule } from './api/api.module';
import { StartWizard } from './start/start.scene';
import { ApiService } from './api/api-service';
import { SchedulerModule } from './scheduler/scheduler.module';
import { SubscriptionCommandService } from './commands/subscription-command.service';

export const sessionMiddleware = session();

@Module({
  imports: [
    HttpModule,
    PrismaModule,
    NestScheduleModule.forRoot(),
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN,
      middlewares: [sessionMiddleware],
    }),
    UsersModule,
    ApiModule,
    SchedulerModule,
  ],
  providers: [
    AppService,
    AirQService,
    ApiService,
    StartWizard,
    SubscriptionCommandService,
  ],
})
export class AppModule {}
