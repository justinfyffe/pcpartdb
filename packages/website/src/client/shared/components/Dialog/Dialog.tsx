import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { FunctionComponent } from 'react';
import { classNames } from '../../ui';
import { Button } from '../Button/Button';
import { closeDialog } from './dialog';

export interface DialogProps {
  title?: string;
  showClose?: boolean;

  className?: string;
  children?: React.ReactNode;
}

export const Dialog: FunctionComponent<DialogProps> = (props) => {
  const { title, showClose, className, children } = props;

  return (
    <div
      className={classNames(
        'bg-white flex flex-col max-w-[80%] p-4 overflow-auto rounded shadow gap-2 max-h-[90%]',
        className,
      )}
    >
      {(title != null || showClose) && (
        <div className="flex justify-between gap-4 items-center mb-4">
          {title != null && <h3 className="mb-0">{title}</h3>}
          {showClose && (
            <Button onClick={() => closeDialog()} className="p-0">
              <XMarkIcon className="w-8" />
            </Button>
          )}
        </div>
      )}

      <div className="overflow-auto">{children}</div>
    </div>
  );
};
