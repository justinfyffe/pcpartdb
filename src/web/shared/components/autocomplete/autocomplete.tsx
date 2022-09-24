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
      value: propsValue,
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
      document.addEventListener('click', () => {
        setOpen(false);
      });

      window.addEventListener('resize', () => {
        setOpen(false);
      });
    }, []);

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
          setOpen(false);
          onChange?.(value);
        }
      },
      [onChange, isOpen, items, hoveredIndex, totalChildren],
    );

    const handleChildClick = useCallback(
      (index: number) => {
        const item = items[index];
        setValue(item.value);
        setQuery(item.label);
        setOpen(false);
        onChange?.(item.value);
      },
      [onChange, items],
    );

    const handleClear = useCallback(() => {
      setValue(null);
      setQuery(null);
      onChange?.(null);
    }, [onChange]);

    const handleBlur = useCallback(() => {
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

    return (
      <AutocompleteContext.Provider value={{ hoveredIndex }}>
        <div className={classNames('block relative', className)}>
          <TextInput
            value={query || ''}
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
