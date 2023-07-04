import React, { forwardRef, HTMLProps } from 'react';
import { classNames } from '../../ui';

export enum ButtonVariant {
  None = 'none',
  Generic = 'generic',
  Primary = 'primary',
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Danger = 'danger',
  Link = 'link',
}

export interface ButtonProps
  extends Omit<HTMLProps<HTMLButtonElement>, 'as' | 'style'> {
  as?: React.ElementType;

  variant?: ButtonVariant;
  ref?: null;
}

const BUTTON_VARIANTS = {
  [ButtonVariant.None]: 'bg-transparent text-inherit shadow-none',
  [ButtonVariant.Generic]: 'bg-default border-px text-content',
  [ButtonVariant.Primary]: 'bg-primary text-default',
  [ButtonVariant.Info]: 'bg-info text-default',
  [ButtonVariant.Success]: 'bg-success text-default',
  [ButtonVariant.Warning]: 'bg-warning text-default',
  [ButtonVariant.Danger]: 'bg-danger text-default',
  [ButtonVariant.Link]:
    'bg-transparent text-content shadow-none mx-[-16px] my-[-8px] text-link',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
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
          'relative font-medium no-underline text-center cursor-pointer inline-block px-4 py-2 rounded shadow',
          BUTTON_VARIANTS[variant ?? ButtonVariant.None],
          props.disabled
            ? 'bg-disabled border-disabled text-disabled cursor-default'
            : '',
          className,
        )}
        ref={ref}
      >
        {props.children}
      </Element>
    );
  },
);
Button.displayName = 'Button';
