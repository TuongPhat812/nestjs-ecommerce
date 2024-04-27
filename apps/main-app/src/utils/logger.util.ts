/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as winston from 'winston';
import { winstonOptions } from '../configs/logger.config';

class Logger {
  private static _logger: winston.Logger;

  private metadata: object = {};

  getMetadata() {
    return this.metadata;
  }

  private static getLogger(): winston.Logger {
    if (!Logger._logger) {
      Logger._logger = winston.createLogger(winstonOptions);
    }
    return Logger._logger;
  }

  private _childLogger: winston.Logger;

  constructor(
    metadata: { context?: string | null; functionName?: string | null; metadata?: object | null } = {
      context: null,
      functionName: null,
      metadata: {},
    },
  ) {
    this._childLogger = Logger.getLogger().child(metadata);
    this.metadata = metadata;
  }

  static crit(message: string) {
    Logger.getLogger().crit(message);
  }

  static error(message: string) {
    Logger.getLogger().error(message);
  }

  static warn(message: string) {
    Logger.getLogger().warn(message);
  }

  static info(message: string) {
    Logger.getLogger().info(message);
  }

  static http(message: string) {
    Logger.getLogger().http(message);
  }

  static verbose(message: string) {
    Logger.getLogger().verbose(message);
  }

  static debug(message: string) {
    Logger.getLogger().debug(message);
  }

  static silly(message: string) {
    Logger.getLogger().silly(message);
  }

  crit(message: string): void {
    this._childLogger.crit(message);
  }

  error(message: string): void {
    this._childLogger.error(message);
  }

  warn(message: string): void {
    this._childLogger.warn(message);
  }

  info(message: string): void {
    this._childLogger.info(message);
  }

  http(message: string): void {
    this._childLogger.http(message);
  }

  verbose(message: string): void {
    this._childLogger.verbose(message);
  }

  debug(message: string): void {
    this._childLogger.debug(message);
  }

  silly(message: string): void {
    this._childLogger.silly(message);
  }

  setMetadata(metadata: object = {}) {
    const newLogger = new Logger({ ...this.metadata, metadata });
    return newLogger;
  }

  addFunctionName(name: string) {
    const newLogger = new Logger({ ...this.metadata, functionName: name });
    return newLogger;
  }
}

export { Logger };
