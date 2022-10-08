import classnames from 'classnames';
import { overrideTailwindClasses } from 'tailwind-override';

export function classNames(...args: Parameters<typeof classnames>) {
  return overrideTailwindClasses(classnames(args));
}
