export class ApplicationError extends Error {
  public readonly statusCode: number;
  success: boolean;

  constructor(message: string, statusCode: number = 500, success: boolean = false) {
    super(message);
    this.name = 'ApplicationError';
    this.statusCode = statusCode;
    this.success = success;
    Object.setPrototypeOf(this, ApplicationError.prototype, ); // Fix for instanceof
  }
}