import { Injectable, Logger } from '@nestjs/common';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  LOG = 2,
  DEBUG = 3,
  VERBOSE = 4,
}

@Injectable()
export class LoggingService {
  private readonly logger = new Logger(LoggingService.name);
  private readonly logLevel: LogLevel;

  constructor() {
    const level = process.env.LOG_LEVEL?.toLowerCase() || 'log';
    this.logLevel = this.parseLogLevel(level);
  }

  private parseLogLevel(level: string): LogLevel {
    switch (level) {
      case 'error':
        return LogLevel.ERROR;
      case 'warn':
        return LogLevel.WARN;
      case 'log':
        return LogLevel.LOG;
      case 'debug':
        return LogLevel.DEBUG;
      case 'verbose':
        return LogLevel.VERBOSE;
      default:
        return LogLevel.LOG;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
  }

  log(message: string, context?: string) {
    if (this.shouldLog(LogLevel.LOG)) {
      this.logger.log(message, context);
    }
  }

  error(message: string, trace?: string, context?: string) {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.logger.error(message, trace, context);
    }
  }

  warn(message: string, context?: string) {
    if (this.shouldLog(LogLevel.WARN)) {
      this.logger.warn(message, context);
    }
  }

  debug(message: string, context?: string) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.logger.debug(message, context);
    }
  }

  verbose(message: string, context?: string) {
    if (this.shouldLog(LogLevel.VERBOSE)) {
      this.logger.verbose(message, context);
    }
  }
}
