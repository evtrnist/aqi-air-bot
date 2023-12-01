import { Injectable } from '@nestjs/common';
import { Hears, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'vm';
import { AirQService } from './air-q.service';

@Update()
@Injectable()
export class AppService {
  constructor(private readonly airQService: AirQService) {}
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
  async hearsHi(ctx: Context) {
    const reply = await this.airQService.onMessage();
    console.log(123, reply.data);
    await ctx.reply(reply.data);
  }
}
