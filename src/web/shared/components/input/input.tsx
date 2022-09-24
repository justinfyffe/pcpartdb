import { XIcon } from '@heroicons/react/outline';
import React, {
  ChangeEvent,
  forwardRef,
  KeyboardEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { classNames } from '../../ui/ui.utils';
import { Button } from '../button';
import { FieldContext } from '../field';

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { value: propsValue, prefix, suffix } = props;
  const { onPrefixClick, onSuffixClick, onClear, onKeyDown, onBlur, onChange } =
    props;

  const [value, setValue] = useState(propsValue ?? null);

  useEffect(() => setValue(propsValue), [propsValue]);

  const handlePrefixClick = useCallback(() => onPrefixClick(), [onPrefixClick]);
  const handleSuffixClick = useCallback(() => onSuffixClick(), [onSuffixClick]);

  const handleClear = useCallback(() => {
    setValue(null);
    onChange?.(null);
    onClear?.();
  }, [onChange, onClear]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => onKeyDown?.(e),
    [onKeyDown],
  );

  const handleBlur = useCallback(() => {
    onBlur?.();
  }, [onBlur]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const newValue = inputValue !== '' ? inputValue : null;
      setValue(newValue);
      onChange?.(newValue);
    },
    [onChange],
  );

  const context = useContext(FieldContext);

  return (
    <div className={classNames('relative', props.className)}>
      <input
        type={props.type ?? 'text'}
        value={value || ''}
        id={context?.fieldId}
        placeholder={props.placeholder}
        className={classNames(
          'border m-0 p-3 rounded text-sm w-full shadow',
          props.clearable ? 'pr-12' : '',
          props.prefix ? 'pl-12' : '',
        )}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
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
            <XIcon className="w-[16px]" />
          </Button>
        )}
      </div>
    </div>
  );
});
Input.displayName = 'Input';

export interface InputProps {
  type: string;

  placeholder?: string;

  clearable?: boolean;
  prefix?: string | React.ReactElement;
  suffix?: string | React.ReactElement;

  onPrefixClick?: () => void;
  onSuffixClick?: () => void;
  onClear?: () => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  onBlur?: () => void;

  value?: string;
  onChange?: (value: string) => void;

  className?: string;
}
