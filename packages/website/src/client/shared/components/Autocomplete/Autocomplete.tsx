import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import React, {
  Children,
  forwardRef,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useThrottle } from '../../hooks/useThrottle';
import { classNames } from '../../ui/classNames';
import { TextInput, TextInputProps } from '../Input/TextInput';
import { Spinner } from '../Spinner/Spinner';
import { AutocompleteContext } from './AutocompleteContext';
import { AutocompleteOptionProps } from './AutocompleteOption';
import { AutocompleteResult } from './types';

const DEFAULT_THROTTLE_MS = 500;

export interface AutocompleteProps extends Omit<TextInputProps, 'value'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;

  // Allow arbitrary values
  freeSolo?: boolean;

  direction?: 'top' | 'bottom';
  onQuery: (query: string) => boolean | Promise<boolean>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (value: any) => void;
  onOpen?: () => void;
  onClose?: () => void;

  label?: string;
  prefix?: string | React.ReactElement;
  placeholder?: string;
  throttleTimeout?: number;

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
      placeholder,
      throttleTimeout,
      freeSolo,
      onChange,
      onQuery,
      onOpen,
      onClose,
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

    const openResults = useCallback(() => {
      if (isOpen) {
        return;
      }

      setOpen(true);
      onOpen?.();
    }, [isOpen, onOpen]);
    const closeResults = useCallback(() => {
      if (!isOpen) {
        return;
      }

      setOpen(false);
      onClose?.();
    }, [isOpen, onClose]);

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

        if (hasResults) {
          openResults();
        } else {
          closeResults();
        }
      },
      [closeResults, freeSolo, onChange, onQuery, openResults],
    );
    const throttledOnChange = useThrottle(
      handleQuery,
      throttleTimeout ?? DEFAULT_THROTTLE_MS,
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
          closeResults();
        }
      },
      [
        isOpen,
        hoveredIndex,
        totalChildren,
        hoveredResult,
        onChange,
        closeResults,
      ],
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
        closeResults();
      },
      [closeResults, onChange],
    );

    const handleBlur = useCallback(() => {
      closeResults();

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
    }, [closeResults, freeSolo, query, onChange, propsLabel]);

    const handleFocus = useCallback(async () => {
      setLoading(true);
      setHoveredIndex(-1);
      const hasResults = await onQuery(query);
      setLoading(false);

      if (hasResults) {
        openResults();
      } else {
        closeResults();
      }
    }, [onQuery, query, openResults, closeResults]);

    const handleSuffixMouseDown = useCallback(() => {
      if (isOpen) {
        closeResults();
      } else {
        handleFocus();
        (ref as any)?.current?.focus();
      }
    }, [closeResults, handleFocus, isOpen, ref]);

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
            suffix={
              isLoading ? (
                <Spinner />
              ) : isOpen ? (
                <ChevronUpIcon className="w-4" />
              ) : (
                <ChevronDownIcon className="w-4" />
              )
            }
            placeholder={placeholder}
            value={query || ''}
            onChange={throttledOnChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onSuffixMouseDown={handleSuffixMouseDown}
            className="w-full"
            ref={ref}
            clearable={!disabled && !!value}
          />

          <div
            onMouseDown={handleChildrenMouseDown}
            className={classNames(
              'absolute bg-white border-[1px_solid_#ccc] shadow-md left-0 right-0 z-30 mt-px max-h-110 overflow-y-auto',
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
