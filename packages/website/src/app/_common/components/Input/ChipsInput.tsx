'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import React, {
  FocusEvent,
  forwardRef,
  FunctionComponent,
  KeyboardEvent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { classNames } from '../../utils/classNames';
import { Button } from '../Button/Button';
import { ButtonVariant } from '../Button/types';
import { InputProps } from './Input';
import { TextInput } from './TextInput';

export interface ChipsInputProps
  extends Omit<InputProps, 'type' | 'value' | 'onChange'> {
  value?: string[];
  onChange?: (value: string[]) => void;

  placeholder?: string;
  disabled?: boolean;
}

export const ChipsInput = forwardRef<HTMLInputElement, ChipsInputProps>(
  (props, ref) => {
    const { value, onChange, disabled, ...restProps } = props;

    const rawValue = value ?? null;
    const chips = useMemo(() => rawValue || [], [rawValue]);

    const [inputValue, setInputValue] = useState<string>('');

    const handleInputChange = useCallback((value: string) => {
      setInputValue(value ?? '');
    }, []);

    const handleKeyDown = useCallback(
      (e?: KeyboardEvent) => {
        const evt = e as KeyboardEvent<HTMLInputElement>;
        if (evt?.key !== 'Enter' && evt?.key !== 'Tab') {
          return;
        }

        evt.preventDefault();
        evt.stopPropagation();

        const chipValue = evt?.currentTarget.value.trim();
        if (chipValue.length === 0) {
          return;
        }

        const newChips = [...chips];
        newChips.push(chipValue);

        onChange?.(newChips);
        setInputValue('');
      },
      [chips, onChange],
    );

    const handleBlur = useCallback(
      (e?: FocusEvent) => {
        const evt = e as FocusEvent<HTMLInputElement>;
        evt?.preventDefault();
        evt?.stopPropagation();

        const chipValue = evt?.currentTarget.value.trim();
        if (chipValue.length === 0) {
          return;
        }

        const newChips = [...chips];
        newChips.push(chipValue);

        onChange?.(newChips);
        setInputValue('');
      },
      [chips, onChange],
    );

    const handleClear = useCallback(
      (i: number) => {
        const newValue = [...chips];
        newValue.splice(i, 1);

        onChange?.(newValue);
      },
      [chips, onChange],
    );

    return (
      <div
        className={classNames(
          'flex flex-col',
          chips.length > 0 ? 'border-px' : '',
        )}
      >
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 p-2">
            {chips.map((chip, i) => (
              <Chip
                key={i}
                value={chip}
                disabled={disabled}
                onClear={() => handleClear(i)}
              />
            ))}
          </div>
        )}
        <TextInput
          {...restProps}
          value={inputValue}
          disabled={disabled}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          ref={ref}
        />
      </div>
    );
  },
);
ChipsInput.displayName = 'ChipsInput';

interface ChipProps {
  value: string;
  onClear?: () => void;

  disabled?: boolean;
}

export const Chip: FunctionComponent<ChipProps> = (props) => {
  const { value, onClear, disabled } = props;

  return (
    <div
      className={classNames(
        'flex items-center justify-between px-2 py-1 rounded-full',
        disabled ? 'bg-disabled' : 'bg-light-shades',
      )}
    >
      <span className="mx-2">{value}</span>
      {!disabled && (
        <Button className="p-2" variant={ButtonVariant.None} onClick={onClear}>
          <XMarkIcon className="w-4" />
        </Button>
      )}
    </div>
  );
};
