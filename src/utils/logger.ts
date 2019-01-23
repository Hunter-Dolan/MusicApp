const INFO  = 'INFO';
const DEBUG = 'DEBUG';
const ERROR = 'ERROR';

const LOGGING_LEVELS:{[key: string]: number} = {
  ERROR: 0,
  INFO:  1,
  DEBUG: 2,
};

export class Logger {
  logLevel: number = 2;

  public info(...messages: any[]) {
    this.log(INFO, messages);
  }

  public debug(...messages: any[]) {
    this.log(DEBUG, messages);
  }

  public error(...messages: any[]) {
    this.log(ERROR, messages);
  }

  private log(type: string, messages: any[]) {
    const level = LOGGING_LEVELS[type];

    if (level > this.logLevel) {
      return;
    }

    console.log(`[${type}] ${messages.join(' ')}`);
  }
}
