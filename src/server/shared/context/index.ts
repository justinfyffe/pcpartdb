import { ApiContext } from '../api/context';
import { SsrContext } from '../ssr/context';

export type Context = ApiContext | SsrContext;
