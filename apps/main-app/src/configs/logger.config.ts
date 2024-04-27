/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prefer-const */
import * as winston from 'winston';
import * as colors from '@colors/colors/safe';
const { combine, colorize, label, timestamp, printf } = winston.format;
import { format } from 'fecha';

const loggerCustomLevels = {
  levels: {
    crit: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    verbose: 5,
    debug: 6,
    silly: 7,
  },
  colors: {
    crit: 'bgBrightRed',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'blue',
    verbose: 'cyan',
    debug: 'magenta',
    silly: 'white',
  },
};

const timeFormat = () => {
  return format(new Date(), 'YYYY-MM-DD hh:mm:ss Z');
};

const winstonOptions = {
  levels: loggerCustomLevels.levels,
  transports: [
    new winston.transports.Console({
      level: 'silly',
      format: combine(
        label({ label: process.env.APP_NAME || 'Winston' }),
        timestamp({ format: timeFormat }),
        printf((info) => {
          const colorizer = colorize({ colors: loggerCustomLevels.colors, all: true });
          let { label, timestamp, level, context, functionName, message, metadata } = info;

          label = `[${label}]`;
          timestamp = `[${timestamp}]`;
          level = level.toUpperCase().padEnd(8, ' ');
          context = context ? ` [${context}]` : '';
          functionName = functionName ? ` [${functionName}]` : '';
          metadata = metadata ? ` ||| ${JSON.stringify(metadata)}` : '';

          const returnMessage = `${label} ${timestamp} ${level} |${context}${functionName} ${message}${metadata}`;

          return colorizer.colorize(info.level, colors.bold(returnMessage));
        }),
      ),
    }),
  ],
};

export { winstonOptions };
