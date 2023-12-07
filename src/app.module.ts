import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { AirQService } from './air-q.service';
import { PrismaModule } from 'prisma/prisma.module';
import { StartCommandService } from './start-command.service';

@Module({
  imports: [
    HttpModule,
    PrismaModule,
    ScheduleModule.forRoot(),
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AirQService, StartCommandService],
})
export class AppModule {}
