import React, { forwardRef, HTMLProps, useCallback, useState } from 'react';
import { classNames } from '../../ui/classNames';

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

  disableAfterClickSeconds?: number;
  showDisabledTimer?: boolean;
  variant?: ButtonVariant;
  ref?: null;
}

const BUTTON_VARIANTS = {
  [ButtonVariant.None]: 'bg-transparent text-inherit shadow-none',
  [ButtonVariant.Generic]: 'bg-default border-px text-content',
  [ButtonVariant.Primary]: 'bg-primary text-default',
  [ButtonVariant.Info]: 'bg-info text-default',
  [ButtonVariant.Success]: 'bg-success text-default',
  [ButtonVariant.Warning]: 'bg-warning text-content',
  [ButtonVariant.Danger]: 'bg-danger text-default',
  [ButtonVariant.Link]:
    'bg-transparent text-content shadow-none mx-[-16px] my-[-8px] text-link',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const {
      as,
      href,
      variant,
      className,
      type,
      disableAfterClickSeconds,
      showDisabledTimer,
      onClick,
      ...htmlProps
    } = props;

    let url;
    if (href) {
      url = href;
    }

    let Element = as;
    if (Element == null) {
      Element = url ? 'a' : 'button';
    }

    const isButton = Element === 'button';

    // States

    const [disabledAfterClick, setDisabledAfterClick] = useState(false);
    const [disabledAfterClickTimer, setDisabledAfterClickTimer] = useState(0);

    // Callbacks

    const processClick = useCallback(
      (evt: React.MouseEvent<HTMLButtonElement>) => {
        // If desired, disable the button to prevent too many repeated clicks.
        if (disableAfterClickSeconds != null) {
          // Countdown
          for (let i = 0; i <= disableAfterClickSeconds; ++i) {
            setTimeout(() => {
              setDisabledAfterClickTimer(disableAfterClickSeconds - i);
              setDisabledAfterClick(disableAfterClickSeconds - i !== 0);
            }, i * 1_000);
          }
        }

        onClick?.(evt);
      },
      [disableAfterClickSeconds, onClick],
    );

    // Render

    return (
      <Element
        {...htmlProps}
        type={isButton ? type ?? 'button' : undefined}
        href={url}
        className={classNames(
          'relative font-medium no-underline text-center cursor-pointer inline-block px-4 py-2 rounded shadow',
          BUTTON_VARIANTS[variant ?? ButtonVariant.None],
          props.disabled || disabledAfterClick
            ? 'bg-disabled border-disabled text-disabled cursor-default'
            : '',
          className,
        )}
        disabled={props.disabled || disabledAfterClick}
        ref={ref}
        onClick={processClick}
      >
        {showDisabledTimer && disabledAfterClick ? (
          <>{disabledAfterClickTimer}</>
        ) : (
          <>{props.children}</>
        )}
      </Element>
    );
  },
);
Button.displayName = 'Button';
