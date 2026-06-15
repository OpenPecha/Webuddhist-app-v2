export class ServerFailure extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'ServerFailure';
  }
}

export class NetworkFailure extends Error {
  constructor() {
    super('No network connection');
    this.name = 'NetworkFailure';
  }
}

export class AuthenticationFailure extends Error {
  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationFailure';
  }
}

export class NotFoundFailure extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundFailure';
  }
}

export class RateLimitFailure extends Error {
  constructor() {
    super('Too many requests');
    this.name = 'RateLimitFailure';
  }
}

export class UnknownFailure extends Error {
  constructor(message = 'An unexpected error occurred') {
    super(message);
    this.name = 'UnknownFailure';
  }
}

export type AppFailure =
  | ServerFailure
  | NetworkFailure
  | AuthenticationFailure
  | NotFoundFailure
  | RateLimitFailure
  | UnknownFailure;
