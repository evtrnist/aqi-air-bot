import { Context as TelegrafContext } from 'telegraf';
import { SessionState } from './session-state';

export type BotContext = TelegrafContext & {
  session: SessionState;
};
