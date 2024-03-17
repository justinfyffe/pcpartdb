'use client';

import React, {
  Children,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { classNames } from '../../utils/classNames';
import { ButtonTabLabels } from './ButtonTabLabels';
import { HorizontalTabLabels } from './HorizontalTabLabels';
import { TabProps } from './Tab';
import { TabsVariant } from './types';

export interface TabsProps {
  variant?: TabsVariant;
  activeTab?: number;
  loadOnDemand?: boolean;

  as?: React.ElementType;
  className?: string;
  tabClassName?: string;

  children?:
    | React.ReactElement<TabProps>
    | React.ReactElement<TabProps>[]
    | any;
}

export function Tabs(props: TabsProps) {
  const { loadOnDemand, children, tabClassName } = props;
  const variant = props.variant || TabsVariant.Horizontal;

  const Element = props.as || 'section';

  const [activeTab, setActiveTab] = useState(props.activeTab || 0);

  const handleTabClick = useCallback((i: number) => {
    setActiveTab(i);
  }, []);

  const labels = useMemo(
    () =>
      Children.map(children, ({ props: { label } }) => {
        return label;
      }),
    [children],
  );

  return (
    <Element className={classNames('flex flex-col', props.className)}>
      {variant === TabsVariant.Horizontal && (
        <HorizontalTabLabels
          labels={labels}
          activeTab={activeTab}
          onTabClick={handleTabClick}
        />
      )}

      {variant === TabsVariant.Buttons && (
        <ButtonTabLabels
          labels={labels}
          activeTab={activeTab}
          onTabClick={handleTabClick}
        />
      )}

      <div
        className={classNames(
          'h-full',
          variant === TabsVariant.Horizontal
            ? 'bg-light-shades p-4 rounded-b'
            : '',
          variant === TabsVariant.Buttons ? 'py-8' : '',
          tabClassName,
        )}
      >
        {Children.map(children, (child, i) => (
          <>
            {(loadOnDemand !== true || activeTab === i) && (
              <div
                key={i}
                className={classNames(
                  'h-full',
                  activeTab !== i ? 'hidden' : '',
                )}
              >
                {child}
              </div>
            )}
          </>
        ))}
      </div>
    </Element>
  );
}
