type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  requestId?: string;
  userId?: string;
  path?: string;
  action?: string;
  [key: string]: unknown;
}

export const logger = {
  log: (level: LogLevel, message: string, context?: LogContext) => {
    const entry = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
      ...(context || {}),
    };

    if (level === 'error') {
      console.error(JSON.stringify(entry));
    } else if (level === 'warn') {
      console.warn(JSON.stringify(entry));
    } else {
      console.log(JSON.stringify(entry));
    }
  },

  info: (message: string, context?: LogContext) => logger.log('info', message, context),
  warn: (message: string, context?: LogContext) => logger.log('warn', message, context),
  error: (message: string, context?: LogContext) => logger.log('error', message, context),
  debug: (message: string, context?: LogContext) => {
    if (process.env.NODE_ENV !== 'production') {
      logger.log('debug', message, context);
    }
  },
};
