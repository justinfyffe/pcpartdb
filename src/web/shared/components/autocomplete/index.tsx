import React, { FunctionComponent, HTMLProps } from 'react';
import { classNames } from '../../ui/ui.utils';
import { Input } from '../input';

interface AutocompletetProps extends HTMLProps<HTMLInputElement> {}

export const Autocomplete: FunctionComponent<AutocompletetProps> = (props) => {
  const { className, ...htmlProps } = props;

  return (
    <div className={classNames('relative', className)}>
      <Input className={classNames(className)} {...htmlProps} />
    </div>
  );
};
