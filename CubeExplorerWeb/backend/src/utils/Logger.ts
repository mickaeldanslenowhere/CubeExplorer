// Logger utility for centralized logging across the application
// Supports both console logging and real-time streaming to frontend

export interface LoggerOptions {
  sendToFrontend?: boolean;
  prefix?: string;
}

export class Logger {
  private static logStream: ((message: string) => void) | null = null;

  /**
   * Set the log stream function for real-time frontend logging
   * @param streamFunction - Function to send logs to frontend
   */
  static setLogStream(streamFunction: (message: string) => void): void {
    this.logStream = streamFunction;
  }

  /**
   * Clear the log stream
   */
  static clearLogStream(): void {
    this.logStream = null;
  }

  /**
   * Log a message
   * @param message - The message to log
   * @param options - Logger options
   */
  static log(message: string, options: LoggerOptions = {}): void {
    const { sendToFrontend = false, prefix = '' } = options;
    const fullMessage = `${prefix} ${message}`
    
    console.log(fullMessage);
    
    if (sendToFrontend && this.logStream) {
      this.logStream(fullMessage);
    }
  }

  /**
   * Log an error message
   * @param message - The error message to log
   * @param options - Logger options
   */
  static error(message: string, options: LoggerOptions = {}): void {
    const { sendToFrontend = false, prefix = '❌' } = options;
    const fullMessage = `${prefix} ${message}`
    
    console.error(fullMessage);
    
    if (sendToFrontend && this.logStream) {
      this.logStream(fullMessage);
    }
  }

  /**
   * Log a warning message
   * @param message - The warning message to log
   * @param options - Logger options
   */
  static warn(message: string, options: LoggerOptions = {}): void {
    const { sendToFrontend = false, prefix = '⚠️' } = options;
    const fullMessage = `${prefix} ${message}`
    
    console.warn(fullMessage);
    
    if (sendToFrontend && this.logStream) {
      this.logStream(fullMessage);
    }
  }

  /**
   * Log a debug message
   * @param message - The debug message to log
   * @param options - Logger options
   */
  static debug(message: string, options: LoggerOptions = {}): void {
    const { sendToFrontend = false, prefix = '🐛' } = options;
    const fullMessage = `${prefix} ${message}`
    
    console.debug(fullMessage);
    
    if (sendToFrontend && this.logStream) {
      this.logStream(fullMessage);
    }
  }

  /**
   * Log an info message
   * @param message - The info message to log
   * @param options - Logger options
   */
  static info(message: string, options: LoggerOptions = {}): void {
    const { sendToFrontend = false, prefix = 'ℹ️' } = options;
    const fullMessage = `${prefix} ${message}`
    
    console.info(fullMessage);
    
    if (sendToFrontend && this.logStream) {
      this.logStream(fullMessage);
    }
  }
}
