export enum HttpErrorType {
  BadRequestError = 'BAD_REQUEST_ERROR',
  ForbiddenError = 'FORBIDDEN_ERROR',
  InternalServerError = 'INTERNAL_SERVER_ERROR',
  NotFoundError = 'NOT_FOUND_ERROR',
  UnauthorizedError = 'UNAUTHORIZED_ERROR',
}

export interface ValidationPropertyError {
  property: string;
  constraint: string;
}

export interface ApiError<T = unknown> {
  type: HttpErrorType;
  statusCode: number;
  timestamp: string;
  data?: T;
}

export interface BadRequestError
  extends ApiError<ValidationPropertyError[] | undefined> {
  type: HttpErrorType.BadRequestError;
}

export interface NotFoundError extends ApiError<{ [key: string]: unknown }> {
  type: HttpErrorType.NotFoundError;
}

export interface InternalServerError extends ApiError {
  type: HttpErrorType.InternalServerError;
}

export interface ForbiddenError extends ApiError {
  type: HttpErrorType.ForbiddenError;
}

export interface UnauthorizedError extends ApiError {
  type: HttpErrorType.UnauthorizedError;
}

export enum ValidationErrorType {
  EmailExists = 'emailExists',
  FileExists = 'fileExists',
  InvalidEmail = 'string.email',
  InvalidToken = 'invalidToken',
  MaxLength = 'string.max',
  MinLength = 'string.min',
  MissingRequiredAny = 'any.required',
  MissingStringValue = 'string.empty',
}
