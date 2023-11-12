import React, {
  Children,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { classNames } from '../../ui/classNames';
import { ButtonTabLabels } from './ButtonTabLabels';
import { HorizontalTabLabels } from './HorizontalTabLabels';
import { TabProps } from './Tab';

export enum TabsVariant {
  Horizontal = 'HORIZONTAL',
  Buttons = 'BUTTONS',
}

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

export const Tabs: FunctionComponent<TabsProps> = (props) => {
  const { loadOnDemand, children, tabClassName } = props;
  const variant = props.variant || TabsVariant.Horizontal;

  const Element = props.as || 'section';

  const [activeTab, setActiveTab] = useState(props.activeTab || 0);
  const [labels, setLabels] = useState<string[]>([]);

  const handleTabClick = useCallback((i: number) => {
    setActiveTab(i);
  }, []);

  useEffect(() => {
    setLabels(Children.map(children, ({ props: { label } }) => label));
  }, [children]);

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
                className={classNames(activeTab !== i ? 'hidden' : '')}
              >
                {child}
              </div>
            )}
          </>
        ))}
      </div>
    </Element>
  );
};
