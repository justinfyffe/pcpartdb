import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { classNames } from '../../utils/classNames';
import { GenericButton } from '../Button/GenericButton';

interface PaginationProps {
  className?: string;

  displayTotal?: boolean;

  offset: number;
  limit: number;
  total: number;

  onChange?: (offset: number, limit: number, event?: React.MouseEvent) => void;
}

export const Pagination: FunctionComponent<PaginationProps> = (props) => {
  const { className, displayTotal, offset, limit, total, onChange } = props;

  const hasPrev = offset > 0;
  const hasNext = offset + limit < total;

  // Memos

  const label = useMemo(() => {
    const start = Math.max(offset, 0) + 1;
    const end = Math.min(offset + limit, total);
    return `${start}-${end} of ${total}`;
  }, [limit, offset, total]);

  // Callbacks

  const previousPage = useCallback(
    (evt: React.MouseEvent) => {
      const newOffset = offset - limit;
      onChange?.(newOffset, limit, evt);
    },
    [limit, offset, onChange],
  );

  const nextPage = useCallback(
    (evt: React.MouseEvent) => {
      const newOffset = offset + limit;
      onChange?.(newOffset, limit, evt);
    },
    [limit, offset, onChange],
  );

  return (
    <nav className={classNames('flex gap-4 items-center', className)}>
      {displayTotal && <>{label}</>}

      <GenericButton onClick={previousPage} disabled={!hasPrev}>
        <ChevronLeftIcon className="w-4" />
      </GenericButton>

      <GenericButton onClick={nextPage} disabled={!hasNext}>
        <ChevronRightIcon className="w-4" />
      </GenericButton>
    </nav>
  );
};
