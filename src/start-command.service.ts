import { Injectable } from '@nestjs/common';
import { Ctx, Message, On, Start, Update } from 'nestjs-telegraf';
import { State } from './session-state';
import { BotContext } from './bot-context.type';

@Update()
@Injectable()
export class StartCommandService {}
