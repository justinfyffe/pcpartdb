import React from 'react';
import { classNames } from '../../utils/classNames';
import { Button } from '../Button/Button';
import { ButtonVariant } from '../Button/types';

export interface ButtonTabLabelsProps {
  labels?: string[];
  activeTab?: number;
  onTabClick?: (tab: number) => void;

  className?: string;
}

export function ButtonTabLabels(props: ButtonTabLabelsProps) {
  const { labels, activeTab, onTabClick, className } = props;

  return (
    <ul className={classNames('flex flex-wrap gap-4', className)}>
      {labels?.map((label, i) => (
        <li className="h-full flex-auto" key={i}>
          <Button
            disabled={i === activeTab}
            variant={ButtonVariant.Generic}
            onClick={() => onTabClick?.(i)}
            className="w-full"
          >
            {label}
          </Button>
        </li>
      ))}
    </ul>
  );
}
