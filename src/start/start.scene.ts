import { Context, Message, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/typings/scenes';
import { Scene } from 'src/constants/scene';
import { UsersService } from 'src/users/users.service';
import { ApiService } from 'src/api/api-service';
import { EMPTY, Observable, catchError } from 'rxjs';

@Wizard(Scene.Start)
export class StartWizard {
  constructor(
    private readonly usersService: UsersService,
    private readonly apiService: ApiService,
  ) {}
  @WizardStep(1)
  async onStep1(@Context() ctx: WizardContext) {
    await ctx.wizard.next();

    await ctx.reply(
      'Привет! Я бот, который поможет отслеживать качество воздуха на улице. Напиши в ответном сообщении название города на английском языке, за качеством воздуха которого ты хочешь следить. Или даже ссылку на станцию с <a href="https://aqicn.org/here/">сайта</a> в формате https://aqicn.org/station/номер_станции',
      { parse_mode: 'HTML' },
    );
  }

  @WizardStep(2)
  async onStep2(
    @Context() ctx: WizardContext,
    @Message() msg: { text: string },
  ) {
    console.log(msg.text);

    let probableSubscription = msg.text.split('/').at(-1);

    if (probableSubscription[0] === '@') {
      probableSubscription = ['A', ...probableSubscription.slice(1)].join('');
    }

    console.log(probableSubscription);

    this.apiService
      .getData$(probableSubscription)
      .pipe(catchError((err) => this.handleError$(err)))
      .subscribe(async () => {
        ctx.wizard.state['subscription'] = msg.text;

        await ctx.wizard.next();

        await ctx.reply(
          'Отлично, я буду присылать тебе данные по (город/станция), а теперь уточни, в какое время тебе бы хотелось получать уведомления в формате HH:MM',
        );
      });
  }

  @WizardStep(3)
  async onStep3(
    @Context() ctx: WizardContext,
    @Message() msg: { text: string },
  ) {
    ctx.wizard.state['time'] = msg.text;

    await ctx.wizard.next();

    await ctx.reply(
      'И теперь мне нужен твой часовой пояс, чтобы точно не промахнуться с уведомлением, напиши его в формате +02 или -02',
    );
  }

  @WizardStep(4)
  async onStep4(
    @Context() ctx: WizardContext,
    @Message() msg: { text: string; from: { id: number } },
  ) {
    ctx.wizard.state['timeZone'] = msg.text;

    await ctx.reply(
      'Все готово! Обрати внимание, что перенастроить время уведомлений, часовой пояс и добавить станций/городов для отслеживания AQI можно в настройках, которые только что появились чуть ниже',
    );

    console.log('wizard', ctx.wizard);

    this.usersService
      .createUser({
        id: msg.from.id,
        subscriptions: [ctx.wizard.state['subscription']],
        time: ctx.wizard.state['time'] as string,
        timeZone: ctx.wizard.state['timeZone'] as string,
      })
      .then((res) => console.log('res', res))
      .catch((e) => console.error(e));
  }

  private handleError$(error: unknown): Observable<never> {
    console.log(error);

    return EMPTY;
  }
}
