/**
 * Simple utility class to manage cancellation state
 * Avoids circular imports between controllers and services
 */
export class CancellationManager {
  private static cancelled = false;

  /**
   * Reset the cancellation flag
   */
  static reset(): void {
    this.cancelled = false;
  }

  /**
   * Set the cancellation flag to true
   */
  static cancel(): void {
    this.cancelled = true;
  }

  /**
   * Check if the operation is cancelled
   */
  static get isCancelled(): boolean {
    return this.cancelled;
  }
}
