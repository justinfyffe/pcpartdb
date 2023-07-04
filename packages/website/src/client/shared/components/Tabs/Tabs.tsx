import React, {
  Children,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { classNames } from '../../ui';
import { Button, ButtonVariant } from '../Button';
import { TabProps } from './Tab';

export interface TabsProps {
  activeTab?: number;
  loadOnDemand?: boolean;

  as?: React.ElementType;
  className?: string;

  children?: React.ReactElement<TabProps> | React.ReactElement<TabProps>[];
}

export const Tabs: FunctionComponent<TabsProps> = (props) => {
  const { loadOnDemand, children } = props;

  const Element = props.as || 'section';

  const [activeTab, setActiveTab] = useState(props.activeTab || 0);
  const [labels, setLabels] = useState<string[]>([]);

  const handleLabelClick = useCallback((i: number) => {
    setActiveTab(i);
  }, []);

  useEffect(() => {
    setLabels(Children.map(children, ({ props: { label } }) => label));
  }, [children]);

  return (
    <Element className={classNames('flex flex-col', props.className)}>
      <ul className="flex items-center justify-start">
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
    </Element>
  );
};
