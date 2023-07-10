import React, { FunctionComponent, useCallback } from 'react';
import { classNames } from '../../ui';
import { Button, ButtonVariant } from '../Button';

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
    <ul className={classNames('flex items-center justify-start', className)}>
      {labels.map((label, i) => (
        <li className="h-full" key={i}>
          {i === activeTab && (
            <div className="bg-light-shades px-4 py-2 font-bold rounded-t">
              {label}
            </div>
          )}
          {i !== activeTab && (
            <Button
              disabled={i === activeTab}
              variant={ButtonVariant.None}
              onClick={() => handleLabelClick(i)}
              className="bg-[#f8f8f8] hover:bg-mouse-hover"
            >
              {label}
            </Button>
          )}
        </li>
      ))}
    </ul>
  );
};
