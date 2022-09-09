import { XIcon } from '@heroicons/react/outline';
import React, {
  FunctionComponent,
  HTMLProps,
  useCallback,
  useContext,
  useRef,
} from 'react';
import { classNames } from '../../ui/ui.utils';
import { Button } from '../button';
import { FieldContext } from '../field';

interface InputProps extends Omit<HTMLProps<HTMLInputElement>, 'ref'> {
  clearable?: boolean;
  suffix?: string | React.ReactElement;

  onPrefixClick?: () => void;
  onSuffixClick?: () => void;
  onClear?: () => void;

  ref?: unknown;
}

export const Input: FunctionComponent<InputProps> = (props) => {
  const {
    prefix,
    suffix,
    clearable: closeable,
    className,
    onClear,
    onPrefixClick,
    onSuffixClick,
    type,
    ...htmlProps
  } = props;

  const inputRef = useRef(null);
  const context = useContext(FieldContext);

  const handleClear = useCallback(() => {
    inputRef.current.value = '';
    onClear && onClear();
  }, [onClear]);

  return (
    <div className={classNames('relative', className)}>
      <input
        type={type ?? 'text'}
        id={context.fieldId}
        className={classNames(
          'border m-0 p-3 rounded text-sm w-full shadow',
          closeable ? 'pr-12' : '',
          prefix ? 'pl-12' : '',
          className,
        )}
        {...htmlProps}
        ref={null}
      />

      {prefix && (
        <div
          className="absolute flex items-center p-[0_16px] left-0 inset-y-0"
          onClick={onPrefixClick}
        >
          {prefix}
        </div>
      )}

      <div className="absolute flex items-stretch right-0 inset-y-0">
        {suffix && (
          <div className="flex items-center p-[0_16px]" onClick={onSuffixClick}>
            {suffix}
          </div>
        )}

        {closeable && (
          <Button className="hover:bg-[#eee]" onClick={handleClear}>
            <XIcon className="w-[16px]" />
          </Button>
        )}
      </div>
    </div>
  );
};
