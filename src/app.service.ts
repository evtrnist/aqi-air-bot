import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  Command,
  Ctx,
  Hears,
  InjectBot,
  Message,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { AirQService } from './air-q.service';

import { Cron, CronExpression } from '@nestjs/schedule';
import { Telegraf } from 'telegraf';

import { DateTime } from 'luxon';
import { getAqiInfo } from './get-aqi-value.map';
import { Scenes } from 'telegraf';
import { Scene } from './constants/scene';
import { UsersService } from './users/users.service';

@Update()
@Injectable()
export class AppService implements OnModuleInit {
  private subscribers = {};
  private hoursMap = {
    8: true,
    20: true,
  };
  constructor(
    private readonly airQService: AirQService,
    @InjectBot() private readonly bot: Telegraf,
    private readonly usersService: UsersService,
  ) {}

  @Start()
  async startCommand(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.scene.enter(Scene.Start);
  }

  @On('text')
  async onText(@Message('text') message: string, @Ctx() ctx) {
    console.log(ctx, message);
  }

  @Hears('/go')
  sendAQI(ctx) {
    this.airQService.onMessage$().subscribe((val) => {
      console.log(val.data);
      const { title, emoji } = getAqiInfo(+val.data.data.aqi);

      ctx.reply(
        `AQI сейчас ${val.data.data.aqi}, состояние воздуха ${title} ${emoji}`,
      );
    });
  }

  @On('sticker')
  async onSticker(ctx) {
    await ctx.reply('Сомнительно, но окэй');
  }

  @Command('subscribe')
  onSubscribeCommand(ctx) {
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

  // new

  async onModuleInit() {
    this.initSnapshot();
  }

  private async initSnapshot() {
    await this.usersService.loadUsersSnapshot();
  }
}
