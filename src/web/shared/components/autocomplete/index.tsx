import { XIcon } from '@heroicons/react/outline';
import React, {
  ChangeEvent,
  FunctionComponent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { classNames } from '../../ui/ui.utils';
import { Input } from '../input';
import { Spinner } from '../spinner';

export interface AutocompleteOption {
  label: string;
  value: string;
}

interface AutocompleteProps {
  // Allow arbitrary values
  freeSolo?: boolean;

  direction?: 'top' | 'bottom';
  onQuery: (query: string) => Promise<AutocompleteOption[]>;

  label?: string;
  value?: string;
  onChange?: (value: string) => void;

  className?: string;

  ref?: unknown;
}

export const Autocomplete: FunctionComponent<AutocompleteProps> = (props) => {
  const {
    className,
    direction,
    label: initialLabel,
    value,
    freeSolo,
    onChange,
    onQuery,
  } = props;

  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [options, setOptions] = useState<AutocompleteOption[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);
  const [label, setLabel] = useState(initialLabel);

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
      const value = event.target.value;
      if (freeSolo) {
        onChange(value);
        setLabel(value);
      }

      setLoading(true);
      setHoveredIndex(-1);
      const options = await onQuery(value);
      setOptions(options);
      setLoading(false);
      setOpen(options.length > 0);
    },
    [freeSolo, onChange, onQuery],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === 'ArrowUp') {
        // up
        setHoveredIndex(hoveredIndex === -1 ? hoveredIndex : hoveredIndex - 1);
      } else if (event.code === 'ArrowDown') {
        // down
        setHoveredIndex(
          hoveredIndex >= options.length ? hoveredIndex : hoveredIndex + 1,
        );
      } else if (event.code === 'Enter' && isOpen && hoveredIndex >= 0) {
        event.preventDefault();
        event.stopPropagation();

        onChange(options[hoveredIndex].value);
        setLabel(options[hoveredIndex].label);
        setOpen(false);
      }
    },
    [onChange, options, hoveredIndex, isOpen],
  );

  const handleOptionClick = useCallback(
    (option: AutocompleteOption) => {
      onChange(option.value);
      setLabel(option.label);
      setOpen(false);
    },
    [onChange],
  );

  const handleClear = useCallback(() => {
    onChange('');
    setLabel('');
  }, [onChange]);

  return (
    <div className={classNames('block relative', className)}>
      <Input
        value={label || value}
        onChange={handleQuery}
        onKeyDown={handleKeyDown}
        className={classNames(className)}
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
        {options.map((option, i) => (
          <div
            key={option.value}
            onClick={() => handleOptionClick(option)}
            className={classNames(
              'items-center pointer flex p-[8px_16px] hover:bg-[#fafafa]',
              hoveredIndex === i ? 'bg-[#fafafa]' : '',
            )}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};
