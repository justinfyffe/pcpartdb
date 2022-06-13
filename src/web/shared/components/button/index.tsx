import React, { FunctionComponent, HTMLProps } from 'react';
import { classNames } from '../../ui/ui.utils';

export enum ButtonVariant {
  None = 'none',
  Default = 'default',
  Primary = 'primary',
  Toolbar = 'toolbar',
}

interface ButtonProps
  extends Omit<HTMLProps<HTMLButtonElement>, 'as' | 'style'> {
  as?: React.ElementType;

  variant?: ButtonVariant;
}

const BUTTON_VARIANTS = {
  [ButtonVariant.None]: 'bg-transparent shadow-none text-slate-700',
  [ButtonVariant.Default]:
    'bg-button-default border-button-default text-slate-800',
  [ButtonVariant.Primary]: 'bg-button-primary text-button-primary',
  [ButtonVariant.Toolbar]: 'shadow-none text-slate-100',
};

export const Button: FunctionComponent<ButtonProps> = (props) => {
  const { as, href, variant, className, type, ...htmlProps } = props;

  let url;
  if (href) {
    url = href;
  }

  let Element = as;
  if (Element == null) {
    Element = url ? 'a' : 'button';
  }

  const isButton = Element === 'button';

  return (
    <Element
      {...htmlProps}
      type={isButton ? type ?? 'button' : undefined}
      href={url}
      className={classNames(
        'cursor-pointer font-medium inline-block no-underline',
        'px-4 py-2 relative rounded text-center shadow',
        BUTTON_VARIANTS[variant ?? ButtonVariant.None],
        className,
      )}
    >
      {props.children}
    </Element>
  );
};
