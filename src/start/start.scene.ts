import { Context, Message, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/typings/scenes';
import { Scene } from 'src/constants/scene';
import { UsersService } from 'src/users/users.service';
import { ApiService } from 'src/api/api-service';
import { Markup } from 'telegraf';
import { EMPTY, catchError } from 'rxjs';

@Wizard(Scene.Start)
export class StartWizard {
  constructor(
    private readonly usersService: UsersService,
    private readonly apiService: ApiService,
  ) {}
  @WizardStep(0)
  async onStep0(@Context() ctx: WizardContext) {
    await ctx.wizard.next();

    await ctx.reply(
      'Привет! Я бот, который помогает отслеживать качество воздуха на улице. Напиши в ответном сообщении название города на английском языке, за качеством воздуха которого ты хочешь следить. Или даже id станции с <a href="https://aqicn.org/here/">сайта</a>',
      { parse_mode: 'HTML' },
    );
  }

  @WizardStep(1)
  async onStep1(
    @Context() ctx: WizardContext,
    @Message() msg: { text: string },
  ) {
    const isNumeric = /^\d+$/.test(msg.text);
    let answer = msg.text;

    if (isNumeric) {
      answer = `A${msg.text}`;
    }
    this.apiService
      .getData$(answer)
      .pipe(
        catchError((err) => {
          console.log(err);
          return EMPTY;
        }),
      )
      .subscribe(async (data) => {
        console.log(data.data);
        if (data.data === 'Unknown station') {
          this.sendCityErrorMessage(ctx);
        } else {
          ctx.wizard.state['subscription'] = msg.text;

          await ctx.wizard.next();

          const place = isNumeric ? 'станции' : 'городу';

          await ctx.reply(
            `Отлично, я буду присылать тебе данные по ${place} ${msg.text.toUpperCase()}, а теперь уточни, в какое время тебе бы хотелось получать уведомления в формате HH:MM`,
          );
        }
      });
  }

  @WizardStep(2)
  async onStep2(
    @Context() ctx: WizardContext,
    @Message() msg: { text: string },
  ) {
    const isValidTime = /^([01]\d|2[0-3]):([0-5]\d)$/.test(msg.text);
    if (!isValidTime) {
      this.sendTimeErrorMessage(ctx);
    } else {
      ctx.wizard.state['time'] = msg.text;

      await ctx.wizard.next();

      await ctx.reply(
        'И теперь мне нужен твой часовой пояс UTC, чтобы точно не промахнуться с уведомлением, напиши его в формате +02 или -02',
      );
    }
  }

  @WizardStep(3)
  async onStep3(
    @Context() ctx: WizardContext,
    @Message() msg: { text: string; from: { id: number } },
  ) {
    const isUtcTimeZone = /^([+-]\d{2})$/.test(msg.text);

    if (!isUtcTimeZone) {
      this.sendTimeZoneErrorMessage(ctx);
    } else {
      ctx.wizard.state['timeZone'] = msg.text;

      this.usersService
        .createUser({
          id: msg.from.id,
          subscriptions: [ctx.wizard.state['subscription']],
          time: ctx.wizard.state['time'] as string,
          timeZone: ctx.wizard.state['timeZone'] as string,
        })
        .then(async () => {
          await ctx.reply(
            'Все готово! Обрати внимание, что перенастроить время уведомлений, часовой пояс и добавить станций/городов для отслеживания AQI можно в настройках, которые только что появились чуть ниже',
            Markup.keyboard([
              ['Настройки'], // Первый ряд кнопок
              ['Подписки'], // Второй ряд кнопок
            ])
              .resize()
              .persistent(true),
          );

          return ctx.scene.leave();
        })
        .catch((e) => console.error(e));
    }
  }

  private async sendCityErrorMessage(@Context() ctx: WizardContext) {
    await ctx.reply(
      'Упс, произошла ошибка с попыткой определить город или станцию. Если ты пытаешься ввести город, то проверь еще раз написание на английском',
      { parse_mode: 'HTML' },
    );

    await ctx.reply(
      'А если проблемы с поиском id станции <a href="https://aqicn.org/here/">сайта</a>, нажми на точку станции, подожди пока загрузится ее страница, прокрути до блока Air Quality Historical Data, двумя строками ниже будет указан id. Ниже есть скриншот с примером',
      { parse_mode: 'HTML' },
    );

    await ctx.replyWithPhoto({ source: './assets/images/example.png' });
  }

  private async sendTimeErrorMessage(@Context() ctx: WizardContext) {
    await ctx.reply(
      'Не получается распознать формат времени. Пожалуйста, проверь его еще раз. Например, 20:30',
    );
  }

  private async sendTimeZoneErrorMessage(@Context() ctx: WizardContext) {
    await ctx.reply(
      'Не получается распознать формат часового пояса. Пожалуйста, проверь его еще раз. Например, +04',
    );
  }
}
