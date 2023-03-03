import { Request, Response } from 'express';
import { Context } from '../context';

export interface ApiRequest extends Request {
  context?: Context;
}

export interface ApiResponse extends Response {}
