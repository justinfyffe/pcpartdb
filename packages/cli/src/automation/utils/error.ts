import { AutomationExecutionError } from '../types';

export function createExecutionError(error: Error) {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
  } as AutomationExecutionError;
}
