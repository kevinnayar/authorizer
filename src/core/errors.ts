class BaseError extends Error {
  public readonly statusCode: number;
  public readonly status: string;

  constructor(message: string, statusCode: number, status: string) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }

  public toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        statusCode: this.statusCode,
        status: this.status,
      },
    };
  }
}

export class UnauthorizedException extends BaseError {
  constructor(message: string) {
    super(message, 401, 'Unauthorized');
  }
}

export class InternalServerException extends BaseError {
  constructor(message: string) {
    super(message, 500, 'Internal Server Error');
  }
}
