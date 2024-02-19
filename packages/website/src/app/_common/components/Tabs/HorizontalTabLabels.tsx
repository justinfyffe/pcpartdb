import React from 'react';
import { classNames } from '../../utils/classNames';
import { Button } from '../Button/Button';
import { ButtonVariant } from '../Button/types';

export interface HorizontalTabLabelsProps {
  labels?: string[];
  activeTab?: number;
  onTabClick?: (tab: number) => void;

  className?: string;
}

export function HorizontalTabLabels(props: HorizontalTabLabelsProps) {
  const { labels, activeTab, onTabClick, className } = props;

  return (
    <ul
      className={classNames(
        'flex items-end justify-start flex-wrap',
        className,
      )}
    >
      {labels?.map((label, i) => (
        <li className="h-full" key={i}>
          {i === activeTab && (
            <div className="bg-light-shades px-4 py-2 font-bold rounded-t whitespace-nowrap">
              {label}
            </div>
          )}
          {i !== activeTab && (
            <Button
              disabled={i === activeTab}
              variant={ButtonVariant.None}
              onClick={() => onTabClick?.(i)}
              className="bg-[#f8f8f8] hover:bg-mouse-hover rounded-t rounded-b-none whitespace-nowrap border-px mr-[-1px] mt-[-1px]"
            >
              {label}
            </Button>
          )}
        </li>
      ))}
    </ul>
  );
}
