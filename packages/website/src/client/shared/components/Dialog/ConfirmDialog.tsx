import React, { FunctionComponent, useCallback } from 'react';
import { classNames } from '../../ui';
import { Button, ButtonVariant } from '../Button';
import { closeDialog } from './dialog';

export interface ConfirmDialogProps {
  label?: string;
  confirmText?: string;
  rejectText?: string;
  onConfirm?: () => void;
  onReject?: () => void;

  className?: string;
}

export const ConfirmDialog: FunctionComponent<ConfirmDialogProps> = (props) => {
  const { onConfirm, onReject, className } = props;
  const label = props.label || 'Are you sure you want to perform that action?';
  const confirmText = props.confirmText || 'Yes';
  const rejectText = props.rejectText || 'No';

  const handleConfirm = useCallback(async () => {
    await onConfirm?.();
    closeDialog();
  }, [onConfirm]);
  const handleReject = useCallback(async () => {
    await onReject?.();
    closeDialog();
  }, [onReject]);

  return (
    <div
      className={classNames(
        'bg-white flex flex-col w-96 max-w-[80%] p-8 overflow-auto max-w-247 rounded shadow gap-2',
        className,
      )}
    >
      <h3>{label}</h3>

      <div className="flex justify-between">
        <Button variant={ButtonVariant.Info} onClick={handleReject}>
          {rejectText}
        </Button>
        <Button variant={ButtonVariant.Primary} onClick={handleConfirm}>
          {confirmText}
        </Button>
      </div>
    </div>
  );
};
