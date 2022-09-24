import { XIcon } from '@heroicons/react/outline';
import React, {
  Children,
  createContext,
  forwardRef,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { classNames } from '../../ui/ui.utils';
import { TextInput, TextInputProps } from '../input';
import { Spinner } from '../spinner';
import { AutocompleteChild } from './autocomplete-child';
import { AutocompleteOptionProps } from './autocomplete-option';

interface AutocompleteState {
  hoveredIndex: number;
}

export const AutocompleteContext = createContext<AutocompleteState>({
  hoveredIndex: -1,
});

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  (props, ref) => {
    const {
      className,
      direction,
      label: propsLabel,
      value,
      freeSolo,
      onChange,
      onQuery,
      children,
    } = props;

    const [context, setContext] = useState<AutocompleteState>({
      hoveredIndex: -1,
    });

    const [items, setItems] = useState<{ label: string; value: string }[]>([]);
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

    const handleQuery = useCallback(
      async (query: string) => {
        if (freeSolo) {
          onChange(query != null ? query : null);
        } else if (query == null) {
          onChange(null);
        }

        setLabel(query);
        setLoading(true);
        setContext({ ...context, hoveredIndex: -1 });
        const hasResults = await onQuery(query);
        setLoading(false);
        setOpen(hasResults);
      },
      [freeSolo, context, onChange, onQuery],
    );

    const handleKeyDown = useCallback(
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

          onChange(items[hoveredIndex].value);
          setLabel(items[hoveredIndex].label);
          setOpen(false);
        }
      },
      [onChange, isOpen, context, items, hoveredIndex, totalChildren],
    );

    const handleChildClick = useCallback(
      (index: number) => {
        const item = items[index];
        onChange(item.value);
        setLabel(item.label);
        setOpen(false);
      },
      [onChange, items],
    );

    const handleBlur = useCallback(() => {
      if (freeSolo) {
        return;
      }

      if (label == null) {
        onChange?.(null);
      } else {
        setLabel(propsLabel);
      }
    }, [freeSolo, propsLabel, label, onChange]);

    const handleClear = useCallback(() => {
      onChange(null);
      setLabel(null);
    }, [onChange]);

    return (
      <AutocompleteContext.Provider value={context}>
        <div className={classNames('block relative', className)}>
          <TextInput
            value={label || ''}
            onChange={handleQuery}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            ref={ref}
          />
          {!isLoading && value && (
            <div
              className="items-center rounded-r-md flex font-medium h-[calc(100%_-_2px)] m-[1px] p-[0_16px] absolute right-0 top-0 hover:bg-[#fafafa]"
              onClick={handleClear}
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
                onClick={() => handleChildClick(i)}
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
  },
);
Autocomplete.displayName = 'Autocomplete';

export interface AutocompleteProps extends TextInputProps {
  // Allow arbitrary values
  freeSolo?: boolean;

  direction?: 'top' | 'bottom';
  onQuery: (query: string) => boolean | Promise<boolean>;

  label?: string;

  children?:
    | React.ReactElement<AutocompleteOptionProps>[]
    | React.ReactElement<AutocompleteOptionProps>;
}
