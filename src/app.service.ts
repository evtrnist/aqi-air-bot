import { Injectable } from '@nestjs/common';
import { Hears, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'vm';
import { AirQService } from './air-q.service';
import { AxiosResponse } from 'axios';
import { EMPTY, catchError } from 'rxjs';

@Update()
@Injectable()
export class AppService {
  constructor(private readonly airQService: AirQService) { }
  getData(): { message: string } {
    return { message: 'Welcome to server!' };
  }

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Сейчас мы узнаем откуда готовилось нагазение');
  }

  @On('sticker')
  async onSticker(ctx: Context) {
    await ctx.reply('Сомнительно, но окэй');
  }

  @Hears('го')
  hearsHi(ctx: Context) {
    this.airQService.onMessage$().pipe(catchError(err => {
      console.error(err);
      return EMPTY;
    })).subscribe((val: AxiosResponse) => {
      console.log(123, val);
      ctx.reply(val);

    });
  }
}
