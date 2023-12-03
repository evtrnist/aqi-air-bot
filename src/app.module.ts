import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { AirQService } from './air-q.service';
// import LocalSession from 'telegraf-session-local';
import { SessionState } from './session-state';
import { StartCommandService } from './start-command.service';

import LocalSession = require('telegraf-session-local');

const localSession = new LocalSession<SessionState>({
  database: 'session_db.json',
});

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN,
      middlewares: [localSession.middleware()],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AirQService, StartCommandService],
})
export class AppModule {}
