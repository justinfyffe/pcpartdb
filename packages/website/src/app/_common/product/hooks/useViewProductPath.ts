import {
  getViewProductPath,
  GetViewProductPathOptions,
} from '@pcpartdb/shared';
import { useMemo } from 'react';

export function useViewProductPath(args: GetViewProductPathOptions) {
  return useMemo(() => getViewProductPath(args), [args]);
}
