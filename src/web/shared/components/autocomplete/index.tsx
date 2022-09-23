import { XIcon } from '@heroicons/react/outline';
import React, {
  ChangeEvent,
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

export interface AutocompleteOption {
  label: string;
  value: string;
}

export interface AutocompleteProps extends InputProps {
  // Allow arbitrary values
  freeSolo?: boolean;

  direction?: 'top' | 'bottom';
  onQuery: (query: string) => void;

  label?: string;
  value?: string;
  onChange?: (value: string) => void;

  className?: string;

  children?: React.ReactNode;
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

  const onQuery = useCallback(
    async (value: string) => {
      if (freeSolo) {
        triggerOnChange(value);
      }

      setLabel(value);
      setLoading(true);
      setContext({ ...context, hoveredIndex: -1 });
      await triggerOnQuery(value);
      setLoading(false);
      setOpen(totalChildren > 0);
    },
    [freeSolo, context, totalChildren, triggerOnChange, triggerOnQuery],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === 'ArrowUp') {
        // up
        setContext({
          ...context,
          hoveredIndex: hoveredIndex === -1 ? hoveredIndex : hoveredIndex - 1,
        });
      } else if (event.code === 'ArrowDown') {
        // down
        setContext({
          ...context,
          hoveredIndex:
            hoveredIndex >= totalChildren ? hoveredIndex : hoveredIndex + 1,
        });
      } else if (event.code === 'Enter' && isOpen && hoveredIndex >= 0) {
        event.preventDefault();
        event.stopPropagation();

        triggerOnChange(options[hoveredIndex].value);
        setLabel(options[hoveredIndex].label);
        setOpen(false);
      }
    },
    [triggerOnChange, isOpen, context, hoveredIndex, totalChildren],
  );

  const onOptionClick = useCallback(
    (option: AutocompleteOption) => {
      triggerOnChange(option.value);
      setLabel(option.label);
      setOpen(false);
    },
    [triggerOnChange],
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
          {children}
        </div>
      </div>
    </AutocompleteContext.Provider>
  );
};

interface AutocompleteItemProps {
  index: number;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  hoveredClassName?: string;
  value?: unknown;
}

export const AutocompleteItem: FunctionComponent<AutocompleteItemProps> = (
  props,
) => {
  const { index, onClick, children, className, hoveredClassName, value } =
    props;

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
