import React, {
  Children,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { classNames } from '../../ui';
import { TabProps } from './Tab';

export interface TabsProps {
  activeTab?: number;

  as?: React.ElementType;
  className?: string;

  children?: React.ReactElement<TabProps> | React.ReactElement<TabProps>[];
}

export const Tabs: FunctionComponent<TabsProps> = (props) => {
  const { children } = props;

  const Element = props.as || 'section';

  const [activeTab, setActiveTab] = useState(props.activeTab);
  const [labels, setLabels] = useState<string[]>([]);

  const handleLabelClick = useCallback((i: number) => {
    setActiveTab(i);
  }, []);

  useEffect(() => {
    setLabels(Children.map(children, ({ props: { label } }) => label));
  }, [children]);

  return (
    <Element className={classNames('', props.className)}>
      {labels.map((label, i) => (
        <div key={i} onClick={() => handleLabelClick(i)}>
          {label}
        </div>
      ))}
      {Children.map(children, (child, i) => (
        <div key={i} className={classNames(activeTab !== i ? 'hidden' : '')}>
          {child}
        </div>
      ))}
      {props.children}
    </Element>
  );
};
