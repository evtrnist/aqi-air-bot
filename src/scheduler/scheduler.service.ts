import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { ApiService } from 'src/api/api-service';
import { concatMap, from } from 'rxjs';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class SchedulerService implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    @InjectBot() private readonly bot: Telegraf,
    private readonly apiService: ApiService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}
  onModuleInit() {
    this.setScheduleNotifications();
  }

  private setScheduleNotifications() {
    const usersSnapshot = this.usersService.usersSnapshot;

    Object.values(usersSnapshot).forEach((user) => {
      // Вместо вычисления одного следующего времени уведомления,
      // создаем cron-выражение для ежедневного повторения в заданное пользователем время.
      const [hour, minute] = user.time.split(':').map(Number);
      const cronExpression = `0 ${minute} ${hour} * * *`;

      user.subscriptions.forEach((subscription) => {
        const job = new CronJob(
          cronExpression,
          () => {
            this.sendNotification(user.id, subscription);
          },
          null,
          true,
          user.timeZone,
        );

        // Добавляем задачу в SchedulerRegistry
        this.schedulerRegistry.addCronJob(
          `notify_${user.id}_${subscription}`,
          job,
        );
      });
    });
  }

  public deleteScheduleNotification() {
    // TO DO
  }

  public updateScheduleNotification() {
    // TO DO
  }

  public createScheduleNotification() {
    // TO DO
  }

  private sendNotification(id: number, subscription: string) {
    from(subscription)
      .pipe(concatMap((subscription) => this.apiService.getData$(subscription)))
      .subscribe((data) => {
        console.log(data, id);
      });

    // await this.bot.telegram.sendMessage(id, message);
  }
}
