import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
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
  providers: [AppService, AirQService],
})
export class AppModule {}
