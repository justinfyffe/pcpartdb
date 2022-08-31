import { XIcon } from '@heroicons/react/outline';
import React, {
  FunctionComponent,
  HTMLProps,
  useCallback,
  useRef,
} from 'react';
import { classNames } from '../../ui/ui.utils';
import { Button } from '../button';

interface InputProps extends HTMLProps<HTMLInputElement> {
  clearable?: boolean;
  suffix?: string;

  onClear?: () => void;
}

export const Input: FunctionComponent<InputProps> = (props) => {
  const {
    prefix,
    suffix,
    clearable: closeable,
    className,
    onClear,
    type,
    ...htmlProps
  } = props;

  const inputRef = useRef(null);

  const handleClear = useCallback(() => {
    inputRef.current.value = '';
    onClear && onClear();
  }, [onClear]);

  return (
    <div className={classNames('relative', className)}>
      <input
        type={type ?? 'text'}
        className={classNames(
          'border m-0 p-3 rounded text-sm w-full shadow',
          closeable ? 'pr-12' : '',
          prefix ? 'pl-12' : '',
          className,
        )}
        ref={inputRef}
        {...htmlProps}
      />

      {prefix && (
        <div className="absolute flex items-center p-[0_16px] left-0 inset-y-0">
          {prefix}
        </div>
      )}

      <div className="absolute flex items-stretch right-0 inset-y-0">
        {suffix && <div className="flex items-center p-[0_16px]">{suffix}</div>}

        {closeable && (
          <Button className="hover:bg-[#eee]" onClick={handleClear}>
            <XIcon className="w-[16px]" />
          </Button>
        )}
      </div>
    </div>
  );
};
