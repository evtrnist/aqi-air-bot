import { Context, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/typings/scenes';
import { Scene } from 'src/constants/scene';

@Wizard('start_scene')
export class StartWizard {
  @WizardStep(1)
  async onStep1(@Context() ctx: WizardContext) {
    console.log(345);
    await ctx.reply(
      'Привет! Я бот, который поможет отслеживать качество воздуха на улице. Напиши в ответном сообщении название города на английском языке, за качеством воздуха которого ты хочешь следить. Или даже ссылку на станцию с сайта https://aqicn.org/here/',
    );
  }
}
