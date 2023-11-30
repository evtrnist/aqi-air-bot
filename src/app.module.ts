import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { AirQService } from './air-q.service';

@Module({
  imports: [
    HttpModule,
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AirQService],
})
export class AppModule {}
