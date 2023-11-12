import React, { FunctionComponent, useCallback } from 'react';
import { classNames } from '../../ui/classNames';
import { Button, ButtonVariant } from '../Button/Button';

export interface HorizontalTabLabelsProps {
  labels?: string[];
  activeTab?: number;
  onTabClick?: (tab: number) => void;

  className?: string;
}

export const HorizontalTabLabels: FunctionComponent<
  HorizontalTabLabelsProps
> = (props) => {
  const { labels, activeTab, onTabClick, className } = props;

  const handleLabelClick = useCallback(
    (i: number) => {
      onTabClick?.(i);
    },
    [onTabClick],
  );

  return (
    <ul
      className={classNames(
        'flex items-end justify-start flex-wrap',
        className,
      )}
    >
      {labels.map((label, i) => (
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
              onClick={() => handleLabelClick(i)}
              className="bg-[#f8f8f8] hover:bg-mouse-hover rounded-t rounded-b-none whitespace-nowrap border-px mr-[-1px] mt-[-1px]"
            >
              {label}
            </Button>
          )}
        </li>
      ))}
    </ul>
  );
};
