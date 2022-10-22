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
  onClear?: () => void;
  onKeyDown?: (e?: KeyboardEvent) => void;
  onBlur?: (e?: FocusEvent) => void;
  onFocus?: (e?: FocusEvent) => void;
  onWheel?: (e?: WheelEvent) => void;

  value?: string;
  onChange?: (value: string) => void;

  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { value: propsValue, prefix, suffix, disabled, readOnly } = props;
  const {
    onPrefixClick,
    onSuffixClick,
    onClear,
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
    () => onPrefixClick?.(),
    [onPrefixClick],
  );
  const handleSuffixClick = useCallback(
    () => onSuffixClick?.(),
    [onSuffixClick],
  );

  const handleClear = useCallback(() => {
    setValue(null);
    onChange?.(null);
    onClear?.();
  }, [onChange, onClear]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => onKeyDown?.(e),
    [onKeyDown],
  );

  const handleClick = useCallback((e: MouseEvent) => onClick?.(e), [onClick]);

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
      onBlur?.(e);
    },
    [onBlur],
  );

  const handleFocus = useCallback(
    (e: FocusEvent) => {
      onFocus?.(e);
    },
    [onFocus],
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      onWheel?.(e);
    },
    [onWheel],
  );

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
          'border m-0 p-3 rounded text-sm w-full shadow focus:outline-offset-1',
          props.clearable ? 'pr-12' : '',
          props.prefix ? 'pl-12' : '',
        )}
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
          className="absolute flex items-center p-[0_16px] left-0 inset-y-0"
          onClick={handlePrefixClick}
        >
          {prefix}
        </div>
      )}

      <div className="absolute flex items-stretch right-0 inset-y-0">
        {props.suffix && (
          <div
            className="flex items-center p-[0_16px]"
            onClick={handleSuffixClick}
          >
            {suffix}
          </div>
        )}

        {props.clearable && (
          <Button className="hover:bg-[#eee]" onClick={handleClear}>
            <XMarkIcon className="w-[16px]" />
          </Button>
        )}
      </div>
    </div>
  );
});
Input.displayName = 'Input';
