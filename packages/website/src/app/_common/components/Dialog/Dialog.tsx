'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../Button/Button';

export interface DialogProps {
  visible?: boolean;

  title?: string;

  showClose?: boolean;
  closeIcon?: React.ReactNode;
  onClose?: () => void;

  className?: string;
  children?: React.ReactNode;
}

export function Dialog(props: DialogProps) {
  const { visible, title, showClose, className, children, onClose } = props;

  const contentRef = useRef(null);

  useEffect(() => {
    if (!contentRef?.current) {
      return;
    }

    contentRef.current.addEventListener('click', (e: any) => {
      if (e.target !== contentRef.current) {
        return;
      }

      onClose?.();
    });
  }, [onClose, visible]);

  if (!visible) {
    return <></>;
  }

  const content = (
    <div className="dialog">
      <div className="dialog-overlay" />
      <div className="dialog-content" ref={contentRef}>
        <div
          className={classNames(
            'bg-white flex flex-col gap-4 h-auto max-h-[80%] max-w-247 w-auto md:max-h-[90%] md:w-[90%] p-4 overflow-auto rounded shadow',
            className,
          )}
        >
          {(title != null || showClose) && (
            <div className="flex justify-between gap-4 items-center mb-4">
              {title != null && <h3 className="mb-0">{title}</h3>}
              {showClose && (
                <Button onClick={onClose} className="p-0">
                  {props.closeIcon ?? <XMarkIcon className="w-8" />}
                </Button>
              )}
            </div>
          )}

          <div className="overflow-auto">{children}</div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
