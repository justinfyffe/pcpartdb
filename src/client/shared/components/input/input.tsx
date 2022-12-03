import { XMarkIcon } from '@heroicons/react/24/outline';
import React, {
  ChangeEvent,
  FocusEvent,
  forwardRef,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  WheelEvent,
} from 'react';
import { classNames } from '../../ui';
import { Button } from '../button';
import { FieldContext } from '../field';

export interface InputProps {
  type: string;

  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;

  clearable?: boolean;
  prefix?: string | React.ReactElement;
  suffix?: string | React.ReactElement;

  onPrefixClick?: () => void;
  onSuffixClick?: () => void;
  onClick?: (e?: MouseEvent) => void;
  onClearing?: (clearing: boolean) => void;
  onKeyDown?: (e?: KeyboardEvent) => void;
  onBlur?: (e?: FocusEvent) => void;
  onFocus?: (e?: FocusEvent) => void;
  onWheel?: (e?: WheelEvent<HTMLInputElement>) => void;

  value?: string;
  onChange?: (value: string) => void;

  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { value: propsValue, prefix, suffix, disabled, readOnly } = props;
  const {
    onPrefixClick,
    onSuffixClick,
    onClearing,
    onKeyDown,
    onClick,
    onBlur,
    onChange,
    onFocus,
    onWheel,
  } = props;

  const [value, setValue] = useState(propsValue ?? null);

  useEffect(() => setValue(propsValue), [propsValue]);

  const handlePrefixClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      onPrefixClick?.();
    },
    [onPrefixClick],
  );
  const handleSuffixClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      onSuffixClick?.();
    },
    [onSuffixClick],
  );

  const handleClear = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      onClearing?.(true);
      setValue(null);
      onChange?.(null);
      onClearing?.(false);
    },
    [onChange, onClearing],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => onKeyDown?.(e),
    [onKeyDown],
  );

  const handleClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      onClick?.(e);
    },
    [onClick],
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const newValue = inputValue !== '' ? inputValue : null;
      setValue(newValue);
      onChange?.(newValue);
    },
    [onChange],
  );

  const handleBlur = useCallback(
    (e: FocusEvent) => {
      e.preventDefault();
      onBlur?.(e);
    },
    [onBlur],
  );

  const handleFocus = useCallback(
    (e: FocusEvent) => {
      e.preventDefault();
      onFocus?.(e);
    },
    [onFocus],
  );

  const handleWheel = useCallback(
    (e: WheelEvent<HTMLInputElement>) => {
      e.preventDefault();
      onWheel?.(e);
    },
    [onWheel],
  );

  const [prefixWidth, setPrefixWidth] = useState();
  const prefixRef = useRef(null);
  useEffect(() => {
    if (prefixRef == null || prefixRef.current == null) {
      return;
    }
    setPrefixWidth(prefixRef?.current?.offsetWidth ?? 0);
  }, [value, prefixRef?.current?.offsetWidth]);

  const context = useContext(FieldContext);

  return (
    <div className={classNames('relative', props.className)}>
      <input
        type={props.type ?? 'text'}
        value={value || ''}
        id={context?.fieldId}
        placeholder={props.placeholder}
        disabled={disabled}
        readOnly={readOnly}
        className={classNames(
          'border m-0 p-3 rounded text-sm w-full shadow focus:outline-offset-2',
          props.clearable ? 'pr-12' : '',
        )}
        style={{
          paddingLeft: props.prefix ? prefixWidth : undefined,
        }}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onWheel={handleWheel}
        ref={ref}
      />

      {props.prefix && (
        <div
          className="absolute flex items-center px-4 left-0 inset-y-0"
          onClick={handlePrefixClick}
          ref={prefixRef}
        >
          {prefix}
        </div>
      )}

      <div className="absolute flex items-stretch right-0 inset-y-0 z-10">
        {props.suffix && (
          <div className="flex items-center px-4" onClick={handleSuffixClick}>
            {suffix}
          </div>
        )}

        {props.clearable && (
          <Button className="hover:bg-[#eee]" onClick={handleClear}>
            <XMarkIcon className="w-4" />
          </Button>
        )}
      </div>
    </div>
  );
});
Input.displayName = 'Input';
