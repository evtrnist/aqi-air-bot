import { Injectable } from '@nestjs/common';
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
import { Context } from 'vm';
import { AirQService } from './air-q.service';

import { Cron, CronExpression } from '@nestjs/schedule';
import { BotContext } from './bot-context.type';
import { State } from './session-state';
import { Telegraf } from 'telegraf';

import { DateTime } from 'luxon';
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

  @Start()
  async startCommand(@Ctx() ctx: BotContext) {
    if (!ctx.session) {
      ctx.session = { currentState: State.AwaitingCity }; // Инициализация сессии
    } else {
      ctx.session.currentState = State.AwaitingCity;
    }
    await ctx.reply(
      'Привет! Я бот, который поможет отслеживать качество воздуха на улице. Напиши в ответном сообщении название города на английском языке, за качеством воздуха которого ты хочешь следить. Или даже ссылку на станцию с сайта https://aqicn.org/here/',
    );
    ctx.session.currentState = State.AwaitingCity;

    await ctx.reply(`Счетчик сессии: ${JSON.stringify(ctx.session)}`);
  }

  @On('text')
  async onText(@Message('text') message: string, @Ctx() ctx: BotContext) {
    if (ctx.session.currentState === State.AwaitingCity) {
      console.log(ctx);
      ctx.session.city = 'yerevan';
      ctx.session.currentState = null;
      await ctx.reply(`Замечательно, ваш город: ${ctx.session.city}`);
      // Выполнение дальнейших действий
    }
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
