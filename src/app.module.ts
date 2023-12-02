import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { AirQService } from './air-q.service';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AirQService],
})
export class AppModule {}
