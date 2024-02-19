'use client';

import React, { useCallback } from 'react';
import { classNames } from '../../utils/classNames';
import { InfoButton } from '../Button/InfoButton';
import { PrimaryButton } from '../Button/PrimaryButton';
import { closeDialog } from './dialog';

export interface ConfirmDialogProps {
  label?: string;
  confirmText?: string;
  rejectText?: string;
  onConfirm?: () => void;
  onReject?: () => void;

  className?: string;
}

export function ConfirmDialog(props: ConfirmDialogProps) {
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
        'bg-white flex flex-col w-96 max-w-[80%] p-8 overflow-auto rounded shadow gap-2',
        className,
      )}
    >
      <h3>{label}</h3>

      <div className="flex justify-between">
        <InfoButton onClick={handleReject}>{rejectText}</InfoButton>
        <PrimaryButton onClick={handleConfirm}>{confirmText}</PrimaryButton>
      </div>
    </div>
  );
}
