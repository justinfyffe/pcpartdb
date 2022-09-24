import { XIcon } from '@heroicons/react/outline';
import React, {
  Children,
  createContext,
  FunctionComponent,
  KeyboardEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { classNames } from '../../ui/ui.utils';
import { Input, InputProps } from '../input';
import { Spinner } from '../spinner';

interface AutocompleteState {
  hoveredIndex: number;
}

const AutocompleteContext = createContext<AutocompleteState>({
  hoveredIndex: -1,
});

interface AutocompleteItem {
  label: string;
  value: string;
}

export interface AutocompleteProps extends InputProps {
  // Allow arbitrary values
  freeSolo?: boolean;

  direction?: 'top' | 'bottom';
  onQuery: (query: string) => boolean | Promise<boolean>;

  label?: string;
  value?: string;
  onChange?: (value: string) => void;

  className?: string;

  children?:
    | React.ReactElement<AutocompleteOptionProps>[]
    | React.ReactElement<AutocompleteOptionProps>;
  ref?: unknown;
}

export const Autocomplete: FunctionComponent<AutocompleteProps> = (props) => {
  const {
    className,
    direction,
    label: propsLabel,
    value,
    freeSolo,
    onChange: triggerOnChange,
    onQuery: triggerOnQuery,
    children,
  } = props;

  const [context, setContext] = useState<AutocompleteState>({
    hoveredIndex: -1,
  });

  const [items, setItems] = useState<AutocompleteItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [label, setLabel] = useState(propsLabel);

  const hoveredIndex = context.hoveredIndex;
  const totalChildren = Children.count(children);

  useEffect(() => {
    setLabel(propsLabel);
  }, [propsLabel]);

  useEffect(() => {
    document.addEventListener('click', () => {
      setOpen(false);
    });

    window.addEventListener('resize', () => {
      setOpen(false);
    });
  }, []);

  useEffect(() => {
    const items = Children.map(children, (child) => ({
      label: child.props.label,
      value: child.props.value,
    }));
    setItems(items);
  }, [children]);

  const onQuery = useCallback(
    async (value: string) => {
      if (freeSolo) {
        triggerOnChange(value);
      }

      setLabel(value);
      setLoading(true);
      setContext({ ...context, hoveredIndex: -1 });
      const hasResults = await triggerOnQuery(value);
      setLoading(false);
      setOpen(hasResults);
    },
    [freeSolo, context, triggerOnChange, triggerOnQuery],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === 'ArrowUp') {
        // up
        const index = hoveredIndex === -1 ? hoveredIndex : hoveredIndex - 1;
        setContext({
          ...context,
          hoveredIndex: index,
        });
      } else if (event.code === 'ArrowDown') {
        // down
        const index =
          hoveredIndex >= totalChildren ? hoveredIndex : hoveredIndex + 1;
        setContext({
          ...context,
          hoveredIndex: index,
        });
      } else if (event.code === 'Enter' && isOpen && hoveredIndex >= 0) {
        event.preventDefault();
        event.stopPropagation();

        triggerOnChange(items[hoveredIndex].value);
        setLabel(items[hoveredIndex].label);
        setOpen(false);
      }
    },
    [triggerOnChange, isOpen, context, items, hoveredIndex, totalChildren],
  );

  const onChildClck = useCallback(
    (index: number) => {
      const item = items[index];
      triggerOnChange(item.value);
      setLabel(item.label);
      setOpen(false);
    },
    [triggerOnChange, items],
  );

  const onClear = useCallback(() => {
    triggerOnChange('');
    setLabel('');
  }, [triggerOnChange]);

  return (
    <AutocompleteContext.Provider value={context}>
      <div className={classNames('block relative', className)}>
        <Input
          value={label || value}
          onChange={onQuery}
          onKeyDown={onKeyDown}
          className={classNames(className)}
        />
        {!isLoading && value && (
          <div
            className="items-center rounded-r-md flex font-medium h-[calc(100%_-_2px)] m-[1px] p-[0_16px] absolute right-0 top-0 hover:bg-[#fafafa]"
            onClick={onClear}
          >
            <XIcon className="w-[16px]" />
          </div>
        )}
        {isLoading && (
          <div className="items-center rounded-r-md flex font-medium h-[calc(100%_-_2px)] m-[1px] p-[0_16px] absolute right-0 top-0 hover:bg-[#fafafa]">
            <Spinner />
          </div>
        )}

        <div
          className={classNames(
            'absolute bg-white border-[1px_solid_#ccc] shadow left-0 right-0 z-10',
            direction === 'top' ? 'bottom-[100%]' : 'top-[100%]',
            isOpen ? 'block' : 'hidden',
          )}
        >
          {Children.map(children, (child, i) => (
            <AutocompleteChild
              key={child.props.value}
              index={i}
              onClick={() => onChildClck(i)}
              className={child.props.className}
              hoveredClassName={child.props.hoveredClassName}
            >
              {child}
            </AutocompleteChild>
          ))}
        </div>
      </div>
    </AutocompleteContext.Provider>
  );
};

interface AutocompleteChildProps {
  index: number;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  hoveredClassName?: string;
}

const AutocompleteChild: FunctionComponent<AutocompleteChildProps> = (
  props,
) => {
  const { index, onClick, children, className, hoveredClassName } = props;

  const { hoveredIndex } = useContext(AutocompleteContext);

  return (
    <div
      onClick={onClick}
      className={classNames(
        'items-center pointer flex p-[8px_16px]',
        hoveredIndex === index ? hoveredClassName : '',
        className,
      )}
    >
      {children}
    </div>
  );
};

export interface AutocompleteOptionProps {
  label: string;
  value: string;

  className?: string;
  hoveredClassName?: string;
  children?: React.ReactNode;
}
