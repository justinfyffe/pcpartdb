import React, {
  Children,
  forwardRef,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { classNames } from '../../ui';
import { TextInput, TextInputProps } from '../Input';
import { Spinner } from '../Spinner';
import { AutocompleteContext } from './AutocompleteContext';
import { AutocompleteOptionProps } from './AutocompleteOption';
import { AutocompleteResult } from './types';

const DEFAULT_DEBOUNCE = 300;

export interface AutocompleteProps extends Omit<TextInputProps, 'value'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;

  // Allow arbitrary values
  freeSolo?: boolean;

  direction?: 'top' | 'bottom';
  onQuery: (query: string) => boolean | Promise<boolean>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (value: any) => void;

  label?: string;
  prefix?: string | React.ReactElement;
  placeholder?: string;
  debounceTimeout?: number;

  children?: React.ReactElement<React.ReactElement<AutocompleteOptionProps>>[];
}

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  (props, ref) => {
    const {
      disabled,
      className,
      direction,
      label: propsLabel,
      value: propsValue,
      prefix,
      suffix,
      placeholder,
      debounceTimeout,
      freeSolo,
      onChange,
      onQuery,
      onSuffixClick,
      children,
    } = props;

    const [query, setQuery] = useState(propsLabel);
    const [value, setValue] = useState(propsValue);
    const [isOpen, setOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(-1);
    const [hoveredResult, setHoveredResult] =
      useState<AutocompleteResult>(null);
    const totalChildren = Children.count(children);

    useEffect(() => setQuery(propsLabel), [propsLabel]);
    useEffect(() => setValue(propsValue), [propsValue]);

    const handleQuery = useCallback(
      async (query: string) => {
        if (freeSolo) {
          onChange?.(query != null ? query : null);
        } else if (query == null) {
          onChange?.(null);
        }

        if (query == null) {
          return;
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
    const debouncedHandleQuery = useDebounce(
      handleQuery,
      debounceTimeout ?? DEFAULT_DEBOUNCE,
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

          const { label, value } = hoveredResult;
          setValue(value);
          setQuery(label);
          onChange?.(value);
          setOpen(false);
        }
      },
      [onChange, isOpen, hoveredResult, hoveredIndex, totalChildren],
    );

    const handleChildrenMouseDown = useCallback((e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    const handleChildClick = useCallback(
      (result: AutocompleteResult) => {
        setValue(result.value);
        setQuery(result.label);
        onChange?.(result.value);
        setOpen(false);
      },
      [onChange],
    );

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
      <AutocompleteContext.Provider
        value={{
          hoveredIndex,
          onClick: handleChildClick,
          onHovered: setHoveredResult,
        }}
      >
        <div className={classNames('block relative w-full', className)}>
          <TextInput
            disabled={disabled}
            prefix={prefix}
            suffix={isLoading ? <Spinner /> : suffix}
            placeholder={placeholder}
            value={query || ''}
            onChange={debouncedHandleQuery}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onSuffixClick={onSuffixClick}
            className="w-full"
            ref={ref}
            clearable={!disabled && !!value}
          />

          <div
            onMouseDown={handleChildrenMouseDown}
            className={classNames(
              'absolute bg-white border-[1px_solid_#ccc] shadow-md left-0 right-0 z-10 mt-px',
              direction === 'top' ? 'bottom-full' : 'top-full',
              isOpen ? 'block' : 'hidden',
            )}
          >
            {children}
          </div>
        </div>
      </AutocompleteContext.Provider>
    );
  },
);
Autocomplete.displayName = 'Autocomplete';
