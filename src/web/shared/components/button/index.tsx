import classNames from 'classnames';
import React, { FunctionComponent, HTMLProps } from 'react';

export enum ButtonStyle {
  None = 'none',
  Default = 'default',
  Primary = 'primary',
  Toolbar = 'toolbar',
}

interface ButtonProps
  extends Omit<HTMLProps<HTMLButtonElement>, 'as' | 'style'> {
  as?: React.ElementType;

  style?: ButtonStyle;
}

const BUTTON_STYLES = {
  [ButtonStyle.None]: 'bg-transparent',
  [ButtonStyle.Default]: 'bg-button-default border-button-default',
  [ButtonStyle.Primary]: 'bg-button-primary text-button-primary',
  [ButtonStyle.Toolbar]: 'text-button-toolbar',
};

export const Button: FunctionComponent<ButtonProps> = (props) => {
  const { as, href, style, className, type, ...htmlProps } = props;

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
        'px-4 py-2 relative rounded text-center',
        BUTTON_STYLES[style ?? ButtonStyle.None],
        className,
      )}
    >
      {props.children}
    </Element>
  );
};
