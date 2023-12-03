export interface SessionState {
  currentState: State;
  city?: string;
  station?: string;

  [key: string]: string;
}

export enum State {
  AwaitingCity = 'AwaitingCity',
}
