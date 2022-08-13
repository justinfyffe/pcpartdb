import { XIcon } from '@heroicons/react/outline';
import React, {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { classNames } from '../../ui/ui.utils';
import { Input } from '../input';
import { Spinner } from '../spinner';

export type AutocompleteValue = string | number;

interface AutocompleteProps {
  direction?: 'top' | 'bottom';
  onQuery: (query: string) => AutocompleteValue[];

  value?: AutocompleteValue;
  onChange?: (value: AutocompleteValue) => void;

  className?: string;
}

export const Autocomplete: FunctionComponent<AutocompleteProps> = (props) => {
  const { className, direction, value, onChange, onQuery } = props;

  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [options, setOptions] = useState<AutocompleteValue[]>([]);

  useEffect(() => {
    document.addEventListener('click', () => {
      setOpen(false);
    });

    window.addEventListener('resize', () => {
      setOpen(false);
    });
  }, []);

  const handleQuery = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      setLoading(true);
      const query = event.target.value;
      const values = await onQuery(query);
      setOptions(values);
      setLoading(false);
      setOpen(true);
    },
    [onQuery, setOptions, setLoading],
  );

  const handleOptionClick = useCallback(
    (value: AutocompleteValue) => {
      onChange(value);
      setOpen(false);
    },
    [onChange],
  );

  const handleClear = useCallback(() => {
    onChange(null);
  }, [onChange]);

  return (
    <div className={classNames('block relative', className)}>
      <Input
        value={value}
        closeable
        onClose={handleClear}
        onChange={handleQuery}
        className={classNames(className)}
      />
      {isLoading && (
        <div className="items-center rounded-r-md flex font-medium h-[calc(100%_-_2px)] m-[1px] p-[0_16px] absolute right-0 top-0 hover:bg-[#fafafa]">
          <XIcon className="w-[16px]" />
        </div>
      )}
      {isLoading && (
        <div
          className="items-center rounded-r-md flex font-medium h-[calc(100%_-_2px)] m-[1px] p-[0_16px] absolute right-0 top-0 hover:bg-[#fafafa]"
          onClick={handleClear}
        >
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
        {options.map((option, i) => (
          <div
            key={i}
            onClick={() => handleOptionClick(option)}
            className={classNames(
              'items-center pointer flex p-[8px_16px] hover:bg-[#fafafa]',
            )}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};
