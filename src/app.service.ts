import { Injectable } from '@nestjs/common';
import { Hears, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'vm';

@Update()
@Injectable()
export class AppService {
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
    await ctx.reply('Hey there');
  }
}
