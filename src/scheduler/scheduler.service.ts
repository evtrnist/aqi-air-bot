import { Injectable, OnModuleInit } from '@nestjs/common';
import { DateTime } from 'luxon';
import { UsersService } from 'src/users/users.service';
import * as nodeSchedule from 'node-schedule';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { User } from '@prisma/client';
import { ApiService } from 'src/api/api-service';
import { concatMap, from } from 'rxjs';

@Injectable()
export class SchedulerService implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    @InjectBot() private readonly bot: Telegraf,
    private readonly apiService: ApiService,
  ) {}
  onModuleInit() {
    this.scheduleNotifications();
  }

  private scheduleNotifications() {
    const usersSnapshot = this.usersService.usersSnapshot;

    Object.values(usersSnapshot).map((user) => {
      const nextNotificationTime = this.calculateNextNotificationTime(user);
      if (nextNotificationTime) {
        nodeSchedule.scheduleJob(nextNotificationTime.toJSDate(), () => {
          this.sendNotification(user);
        });
      }
    });
  }

  private calculateNextNotificationTime(user): DateTime | null {
    // Предполагаем, что `user.time` - это строка в формате "HH:mm",
    // а `user.timeZone` - это строка смещения от UTC, например, "+04".

    // Преобразуем смещение в формат, пригодный для Luxon
    const offset = 'UTC' + user.timeZone.padStart(3, '+'); // Гарантирует формат "+04" или "-05"

    // Получаем текущее время с учетом смещения часового пояса
    const now = DateTime.now().setZone(offset);

    // Разбираем желаемое время уведомлений пользователя
    const [hour, minute] = user.time.split(':').map(Number);

    // Создаем объект DateTime для желаемого времени уведомлений сегодня
    let notificationTime = now.set({ hour, minute, second: 0, millisecond: 0 });

    // Если полученное время уже прошло, планируем уведомление на следующий день
    if (notificationTime <= now) {
      notificationTime = notificationTime.plus({ days: 1 });
    }

    return notificationTime;
  }

  private sendNotification({ id, subscriptions }: User) {
    from(subscriptions)
      .pipe(concatMap((subscription) => this.apiService.getData$(subscription)))
      .subscribe((data) => {
        console.log(data, id);
      });

    // await this.bot.telegram.sendMessage(id, message);
  }
}
