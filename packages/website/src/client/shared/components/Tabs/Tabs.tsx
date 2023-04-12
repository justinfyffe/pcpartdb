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
    <Element className={classNames('flex flex-col gap-4', props.className)}>
      <ul className="flex gap-4">
        {labels.map((label, i) => (
          <li className="flex-1" key={i}>
            <Button
              className="w-full"
              disabled={i === activeTab}
              variant={ButtonVariant.Default}
              onClick={() => handleLabelClick(i)}
            >
              {label}
            </Button>
          </li>
        ))}
      </ul>
      {Children.map(children, (child, i) => (
        <>
          {loadOnDemand !== true ||
            (activeTab === i && (
              <div
                key={i}
                className={classNames(activeTab !== i ? 'hidden' : '')}
              >
                {child}
              </div>
            ))}
        </>
      ))}
    </Element>
  );
};
