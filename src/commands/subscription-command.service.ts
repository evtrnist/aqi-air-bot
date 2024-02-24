import { Injectable } from '@nestjs/common';
import { Ctx, Hears, InjectBot, Update } from 'nestjs-telegraf';
import { catchError, concatMap, from, map, of } from 'rxjs';
import { ApiService } from 'src/api/api-service';
import { getAqiInfo } from 'src/get-aqi-value.map';
import { UsersService } from 'src/users/users.service';
import { Markup, Telegraf } from 'telegraf';

@Update()
@Injectable()
export class SubscriptionCommandService {
  constructor(
    private readonly apiService: ApiService,
    @InjectBot() private readonly bot: Telegraf,
    private readonly usersService: UsersService,
  ) {}

  @Hears('Подписки')
  async onSubscriptions(@Ctx() ctx) {
    const userId = ctx.from.id;
    const user = await this.usersService.findUser(userId);

    // Преобразуем массив подписок пользователя в поток
    from(user.subscriptions)
      .pipe(
        // Для каждой подписки выполняем запрос и обрабатываем результаты последовательно
        concatMap((sub) =>
          this.apiService.getData$(sub).pipe(
            // Преобразовываем данные о качестве воздуха в сообщение
            map((airQualityData) => {
              console.log(airQualityData);

              const { title, emoji } = getAqiInfo(+airQualityData.data.aqi);

              return {
                text: airQualityData
                  ? `AQI ${sub}: ${airQualityData.data.aqi}. Cостояние воздуха ${title} ${emoji}`
                  : `Данные по качеству воздуха в ${sub} не доступны.`,
                sub: sub,
              };
            }),
            // Перехватываем ошибки запроса
            catchError((error) => {
              console.log(error);
              return of({
                text: `Ошибка при получении данных для ${sub}.`,
                sub: sub,
              });
            }),
          ),
        ),
      )
      .subscribe({
        next: ({ text, sub }) => {
          // Отправляем сообщение с данными качества воздуха и кнопками для каждой подписки
          ctx.reply(
            text,
            Markup.inlineKeyboard([
              [
                Markup.button.callback(
                  `Редактировать ${sub}`,
                  `edit_${sub}_${userId}`,
                ),
              ],
              [
                Markup.button.callback(
                  `Удалить ${sub}`,
                  `delete_${sub}_${userId}`,
                ),
              ],
            ]),
          );
        },
        complete: () => {
          // Отправляем сообщение после обработки всех подписок
          ctx.reply(
            'Добавить новую подписку:',
            Markup.inlineKeyboard([
              [Markup.button.callback('Добавить подписку', 'add_new')],
              [Markup.button.callback('Назад', 'back')],
            ]),
          );
        },
      });
    // Добавляем кнопку для добавления новой подписки
    await ctx.reply(
      'Добавить новую подписку:',
      Markup.inlineKeyboard([
        [Markup.button.callback('Добавить подписку', 'add_new')],
        [Markup.button.callback('Назад', 'back')],
      ]),
    );
  }
}
