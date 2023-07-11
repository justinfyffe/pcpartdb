import React, { FunctionComponent, useCallback } from 'react';
import { classNames } from '../../ui';
import { Button, ButtonVariant } from '../Button';

export interface ButtonTabLabelsProps {
  labels?: string[];
  activeTab?: number;
  onTabClick?: (tab: number) => void;

  className?: string;
}

export const ButtonTabLabels: FunctionComponent<ButtonTabLabelsProps> = (
  props,
) => {
  const { labels, activeTab, onTabClick, className } = props;

  const handleLabelClick = useCallback(
    (i: number) => {
      onTabClick?.(i);
    },
    [onTabClick],
  );

  return (
    <ul className={classNames('flex gap-4', className)}>
      {labels.map((label, i) => (
        <li className="h-full flex-auto" key={i}>
          <Button
            disabled={i === activeTab}
            variant={ButtonVariant.Generic}
            onClick={() => handleLabelClick(i)}
            className=" w-full"
          >
            {label}
          </Button>
        </li>
      ))}
    </ul>
  );
};
