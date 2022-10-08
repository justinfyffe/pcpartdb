import React, { FunctionComponent, HTMLProps } from 'react';
import { classNames } from '../../ui/ui.utils';

export enum ButtonVariant {
  None = 'none',
  Default = 'default',
  Primary = 'primary',
  Secondary = 'secondary',
  Toolbar = 'toolbar',
}

interface ButtonProps
  extends Omit<HTMLProps<HTMLButtonElement>, 'as' | 'style'> {
  as?: React.ElementType;

  variant?: ButtonVariant;
}

const BUTTON_VARIANTS = {
  [ButtonVariant.None]: 'bg-transparent shadow-none text-content-primary',
  [ButtonVariant.Default]:
    'bg-button-default border-button-default text-button-default',
  [ButtonVariant.Primary]: 'bg-button-primary text-button-primary',
  [ButtonVariant.Secondary]: 'bg-button-secondary text-button-secondary',
  [ButtonVariant.Toolbar]: 'shadow-none text-toolbar-primary',
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
        'px-4 py-2 relative rounded shadow text-center',
        BUTTON_VARIANTS[variant ?? ButtonVariant.None],
        props.disabled ? 'bg-[#ddd] border-[#ddd] text-[#aaa]' : '',
        className,
      )}
    >
      {props.children}
    </Element>
  );
};
