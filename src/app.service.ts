import { Injectable } from '@nestjs/common';
import { Command, Hears, InjectBot, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'vm';
import { AirQService } from './air-q.service';
import { Telegraf } from 'telegraf';

import { DateTime } from 'luxon';
import { Cron, CronExpression } from '@nestjs/schedule';
import { getAqiInfo } from './get-aqi-value.map';

@Update()
@Injectable()
export class AppService {
  private subscribers = {};
  private hoursMap = {
    8: true,
    20: true,
  };
  constructor(
    private readonly airQService: AirQService,
    @InjectBot() private readonly bot: Telegraf,
  ) {}
  getData(): { message: string } {
    return { message: 'Welcome to server!' };
  }

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Сейчас мы узнаем откуда готовилось нагазение');
  }

  @Hears('/go')
  sendAQI(ctx: Context) {
    this.airQService.onMessage$().subscribe((val) => {
      console.log(val.data);
      const { title, emoji } = getAqiInfo(+val.data.data.aqi);

      ctx.reply(
        `AQI сейчас ${val.data.data.aqi}, состояние воздуха ${title} ${emoji}`,
      );
    });
  }

  @On('sticker')
  async onSticker(ctx: Context) {
    await ctx.reply('Сомнительно, но окэй');
  }

  @Command('subscribe')
  onSubscribeCommand(ctx: Context) {
    if (this.subscribers[ctx.update.message.from.id]) {
      ctx.reply('Уже подписаны');
      return;
    }
    ctx.reply('Подписываю...');

    this.subscribers[ctx.update.message.from.id] = ctx.update.message.chat.id;
  }

  @Cron(CronExpression.EVERY_MINUTE, {
    timeZone: 'Asia/Yerevan',
  })
  handleCron() {
    console.log(this.subscribers);
    const erevanTime = DateTime.now().setZone('Asia/Yerevan');
    if (this.hoursMap[erevanTime.hour] && erevanTime.minute == 0) {
      this.sendNotifications();
    }
  }

  private sendNotifications() {
    console.log('send');

    if (!Object.values(this.subscribers).length) {
      return;
    }

    this.bot.telegram.sendMessage(
      Object.values(this.subscribers)[0] as string,
      'Пытаюсь послать',
    );
    this.airQService.onMessage$().subscribe((val) => {
      for (const subscriber in this.subscribers) {
        const { title, emoji } = getAqiInfo(+val.data.data.aqi);
        this.bot.telegram.sendMessage(
          this.subscribers[subscriber],
          `AQI сейчас ${val.data.data.aqi}, состояние воздуха ${title} ${emoji}`,
        );
      }
    });
  }
}
