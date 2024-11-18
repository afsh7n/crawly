/**
 * Logger utility class for managing application logs.
 */
export class Logger {
    private static levels = {
        info: 'INFO',
        error: 'ERROR',
        debug: 'DEBUG',
        warn: 'WARN',
    };

    /**
     * Logs an informational message.
     * @param message - The message to log.
     */
    static info(message: string): void {
        console.log(`[${Logger.levels.info}] [${Logger.getTimeStamp()}] ${message}`);
    }

    /**
     * Logs an error message.
     * @param message - The message to log.
     * @param error - Optional error object for detailed logs.
     */
    static error(message: string, error?: Error): void {
        console.error(`[${Logger.levels.error}] [${Logger.getTimeStamp()}] ${message}`);
        if (error) {
            console.error(error.stack);
        }
    }

    /**
     * Logs a debug message.
     * @param message - The message to log.
     */
    static debug(message: string): void {
        if (process.env.DEBUG === 'true') {
            console.log(`[${Logger.levels.debug}] [${Logger.getTimeStamp()}] ${message}`);
        }
    }

    /**
     * Logs a warning message.
     * @param message - The message to log.
     */
    static warn(message: string): void {
        console.warn(`[${Logger.levels.warn}] [${Logger.getTimeStamp()}] ${message}`);
    }

    /**
     * Returns the current timestamp for logs.
     * @returns A formatted timestamp string.
     */
    private static getTimeStamp(): string {
        return new Date().toISOString();
    }
}
