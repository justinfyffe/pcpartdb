import { XIcon } from '@heroicons/react/outline';
import React, { FunctionComponent, HTMLProps } from 'react';
import { classNames } from '../../ui/ui.utils';
import { Button } from '../button';

interface InputProps extends HTMLProps<HTMLInputElement> {
  closeable?: boolean;

  onClose?: () => void;
}

export const Input: FunctionComponent<InputProps> = (props) => {
  const { closeable, className, onClose, type, ...htmlProps } = props;

  return (
    <div className={classNames('relative', className)}>
      <input
        type={type ?? 'text'}
        className={classNames(
          'border m-0 p-3 rounded text-sm w-full shadow',
          closeable ? 'pr-12' : '',
          className,
        )}
        {...htmlProps}
      />
      {closeable && (
        <Button className="absolute right-0 inset-y-0" onClick={onClose}>
          <XIcon className="w-[16px]" />
        </Button>
      )}
    </div>
  );
};
