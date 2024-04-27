/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as morgan from 'morgan'
import { TokenIndexer } from 'morgan';
import * as chalk from 'chalk';
import http from 'http';
import { Logger } from '../utils/logger.util';

type Request = http.IncomingMessage;

type Response = http.ServerResponse;

const logger = new Logger({
  context: 'MorganService',
  functionName: 'morganMiddleware',
});

const morganMiddleware = morgan<Request, Response>(
  function (tokens: TokenIndexer<Request, Response>, req: Request, res: Response) {
    const ip: string = (req.headers['x-forwarded-for'] as string) || (req.socket.remoteAddress as string);
    const rawUserAgent = tokens['user-agent'](req, res);
    if (rawUserAgent == 'ELB-HealthChecker/2.0') {
      return;
    }

    const method = chalk.hex('#ff4757').bold(tokens.method(req, res));
    const status = chalk.hex('#ffb142').bold(tokens.status(req, res));
    const url = chalk.hex('#ff5252').bold(tokens.url(req, res));
    const responseTime = chalk.hex('#2ed573').bold(tokens['response-time'](req, res), 'ms');
    const remoteAddress = chalk.yellow(ip);
    const origin = chalk.magenta.bold('from', req.headers.origin);
    const userAgent = chalk.hex('#1e90ff')(tokens['user-agent'](req, res));
    const host = chalk.hex('#ff4757').bold('host', req.headers.host);

    return [method, status, url, responseTime, remoteAddress, host, origin, userAgent].join(' ');
  },
  {
    stream: {
      write: (message: string) => {
        logger.http(message);
      },
    },
  },
);

export { morganMiddleware };
