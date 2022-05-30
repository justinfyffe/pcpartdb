export enum ApiErrorType {
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
  type: ApiErrorType;
  statusCode: number;
  timestamp: string;
  data?: T;
  stack?: string;
}

export interface BadRequestError
  extends ApiError<ValidationPropertyError[] | undefined> {
  type: ApiErrorType.BadRequestError;
}

export interface NotFoundError extends ApiError<{ [key: string]: unknown }> {
  type: ApiErrorType.NotFoundError;
}

export interface InternalServerError extends ApiError {
  type: ApiErrorType.InternalServerError;
}

export interface ForbiddenError extends ApiError {
  type: ApiErrorType.ForbiddenError;
}

export interface UnauthorizedError extends ApiError {
  type: ApiErrorType.UnauthorizedError;
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
