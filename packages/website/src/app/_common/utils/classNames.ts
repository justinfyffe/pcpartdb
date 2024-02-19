import classnames from 'classnames';
import { twMerge } from 'tailwind-merge';

export function classNames(...args: Parameters<typeof classnames>) {
  return twMerge(classnames(args));
}
