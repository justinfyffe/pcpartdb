import { XIcon } from '@heroicons/react/outline';
import React, {
  Children,
  createContext,
  forwardRef,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { classNames } from '../../ui';
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

export interface AutocompleteProps extends TextInputProps {
  // Allow arbitrary values
  freeSolo?: boolean;

  direction?: 'top' | 'bottom';
  onQuery: (query: string) => boolean | Promise<boolean>;

  label?: string;
  prefix?: string | React.ReactElement;

  children?:
    | React.ReactElement<AutocompleteOptionProps>[]
    | React.ReactElement<AutocompleteOptionProps>;
}

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  (props, ref) => {
    const {
      className,
      direction,
      label: propsLabel,
      value: propsValue,
      prefix,
      freeSolo,
      onChange,
      onQuery,
      children,
    } = props;

    const [query, setQuery] = useState(propsLabel);
    const [value, setValue] = useState(propsValue);
    const [isOpen, setOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(-1);
    const [items, setItems] = useState<{ label: string; value: string }[]>([]);
    const totalChildren = Children.count(children);

    useEffect(() => setQuery(propsLabel), [propsLabel]);
    useEffect(() => setValue(propsValue), [propsValue]);

    useEffect(() => {
      setItems(
        Children.map(children, ({ props: { label, value } }) => ({
          label,
          value,
        })),
      );
    }, [children]);

    const handleQuery = useCallback(
      async (query: string) => {
        if (freeSolo) {
          onChange?.(query != null ? query : null);
        } else if (query == null) {
          onChange?.(null);
        }

        setQuery(query);
        setLoading(true);
        setHoveredIndex(-1);
        const hasResults = await onQuery(query);
        setLoading(false);
        setOpen(hasResults);
      },
      [freeSolo, onChange, onQuery],
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.code === 'ArrowUp') {
          const index = hoveredIndex === -1 ? hoveredIndex : hoveredIndex - 1;
          setHoveredIndex(index);
        } else if (e.code === 'ArrowDown') {
          const index =
            hoveredIndex >= totalChildren ? hoveredIndex : hoveredIndex + 1;
          setHoveredIndex(index);
        } else if (e.code === 'Enter' && isOpen && hoveredIndex >= 0) {
          e.preventDefault();
          e.stopPropagation();

          const { label, value } = items[hoveredIndex];
          setValue(value);
          setQuery(label);
          onChange?.(value);
          setOpen(false);
          console.log('handleKeydown', label);
        }
      },
      [onChange, isOpen, items, hoveredIndex, totalChildren],
    );

    const handleChildrenMouseDown = useCallback((e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    const handleChildClick = useCallback(
      (index: number) => {
        const item = items[index];
        setValue(item.value);
        setQuery(item.label);
        onChange?.(item.value);
        setOpen(false);
      },
      [onChange, items],
    );

    const handleClear = useCallback(() => {
      setValue(null);
      setQuery(null);
      onChange?.(null);
    }, [onChange]);

    const handleBlur = useCallback(() => {
      setOpen(false);

      if (freeSolo) {
        return;
      }

      if (query == null) {
        setValue(null);
        setQuery(null);
        onChange?.(null);
      } else {
        setQuery(propsLabel);
      }
    }, [freeSolo, propsLabel, query, onChange]);

    const handleFocus = useCallback(async () => {
      setLoading(true);
      setHoveredIndex(-1);
      const hasResults = await onQuery(query);
      setLoading(false);
      setOpen(hasResults);
    }, [query, onQuery]);

    return (
      <AutocompleteContext.Provider value={{ hoveredIndex }}>
        <div className={classNames('block relative w-full', className)}>
          <TextInput
            prefix={prefix}
            value={query || ''}
            onChange={handleQuery}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={handleFocus}
            className="w-full"
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
            onMouseDown={handleChildrenMouseDown}
            className={classNames(
              'absolute bg-white border-[1px_solid_#ccc] shadow-md left-0 right-0 z-10 mt-[1px]',
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
