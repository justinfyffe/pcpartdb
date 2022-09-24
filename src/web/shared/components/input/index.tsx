import { XIcon } from '@heroicons/react/outline';
import React, {
  ChangeEvent,
  FunctionComponent,
  KeyboardEvent,
  useCallback,
  useContext,
  useRef,
} from 'react';
import { classNames } from '../../ui/ui.utils';
import { Button } from '../button';
import { FieldContext } from '../field';

export interface InputProps {
  type?: string;

  placeholder?: string;

  clearable?: boolean;
  prefix?: string | React.ReactElement;
  suffix?: string | React.ReactElement;

  onPrefixClick?: () => void;
  onSuffixClick?: () => void;
  onClear?: () => void;
  onKeyDown?: (e: KeyboardEvent) => void;

  value?: string;
  onChange?: (value: string) => void;

  className?: string;
  ref?: unknown;
}

export const Input: FunctionComponent<InputProps> = (props) => {
  const {
    prefix,
    suffix,
    clearable,
    placeholder,
    className,
    onChange: triggerOnChange,
    onClear: triggerOnClear,
    onPrefixClick: triggerOnPrefixClick,
    onSuffixClick: triggerOnSuffixClick,
    onKeyDown: triggerOnKeyDown,
    type,
    value,
  } = props;

  const inputRef = useRef(null);
  const context = useContext(FieldContext);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;
      triggerOnChange(value);
    },
    [triggerOnChange],
  );

  const onClear = useCallback(() => {
    inputRef.current.value = '';
    triggerOnClear && triggerOnClear();
  }, [triggerOnClear]);

  return (
    <div className={classNames('relative', className)}>
      <input
        type={type ?? 'text'}
        value={value}
        id={context?.fieldId}
        placeholder={placeholder}
        className={classNames(
          'border m-0 p-3 rounded text-sm w-full shadow',
          clearable ? 'pr-12' : '',
          prefix ? 'pl-12' : '',
          className,
        )}
        onChange={onChange}
        onKeyDown={triggerOnKeyDown}
        ref={null}
      />

      {prefix && (
        <div
          className="absolute flex items-center p-[0_16px] left-0 inset-y-0"
          onClick={triggerOnPrefixClick}
        >
          {prefix}
        </div>
      )}

      <div className="absolute flex items-stretch right-0 inset-y-0">
        {suffix && (
          <div
            className="flex items-center p-[0_16px]"
            onClick={triggerOnSuffixClick}
          >
            {suffix}
          </div>
        )}

        {clearable && (
          <Button className="hover:bg-[#eee]" onClick={onClear}>
            <XIcon className="w-[16px]" />
          </Button>
        )}
      </div>
    </div>
  );
};
