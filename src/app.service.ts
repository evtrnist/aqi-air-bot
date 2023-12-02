import { Injectable } from '@nestjs/common';
import { Hears, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'vm';
import { AirQService } from './air-q.service';
import { AxiosResponse } from 'axios';
import { catchError, interval, of, switchMap, takeUntil } from 'rxjs';
import { DateTime } from 'luxon';

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

  @Hears('подписываюсь')
  hearsHi(ctx: Context) {
    ctx.reply('Теперь буду присылать данные в 8 утра в 20 вечера (если смогу)');
    // Создаем поток, который будет отправлять запросы в 8 утра и 20 вечера каждый день по местному времени
    const requestStream$ = interval(24 * 60 * 60 * 1000) // Один день в миллисекундах
      .pipe(
        switchMap(() => {
          const now = DateTime.now().setZone('Asia/Yerevan'); // Установите свою временную зону
          const currentHour = now.hour;
          const currentMinutes = now.minutes;
          console.log('currentHour', currentHour);
          console.log('currentMinutes', currentMinutes);
          console.log('now', now);

          // Отправляем запрос только если текущее время 8 утра или 20 вечера
          if (
            (currentHour === 8 && currentMinutes === 0) ||
            (currentHour === 20 && currentMinutes === 0)
          ) {
            return this.airQService.onMessage$();
          }

          if (currentHour === 16 && currentMinutes === 0) {
            return this.airQService.onMessage$();
          }

          return of(undefined);
        }),
        catchError((err) => {
          console.error(err);
          return of(null); // Обработка ошибок
        }),
      );

    // Подписываемся на поток запросов и отправляем результат в чат
    requestStream$.subscribe((val: AxiosResponse | null) => {
      if (val !== null) {
        console.log(123, val);
        ctx.reply(val);
      }
    });
  }
}
