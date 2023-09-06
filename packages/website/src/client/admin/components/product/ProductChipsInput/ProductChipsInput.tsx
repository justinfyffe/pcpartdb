import { XMarkIcon } from '@heroicons/react/24/outline';
import { ProductField, ProductFieldKey } from '@pcpartdb/shared';
import {
  Button,
  ButtonVariant,
} from 'packages/website/src/client/shared/components/Button/Button';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, {
  FocusEvent,
  forwardRef,
  FunctionComponent,
  KeyboardEvent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { InputProps } from '../../../../shared/components/Input/Input';
import { TextInput } from '../../../../shared/components/Input/TextInput';

export interface ProductChipsInputProps
  extends Omit<InputProps, 'type' | 'value' | 'onChange'> {
  fieldKey: ProductFieldKey;

  value?: ProductField<string[]>;
  onChange?: (value: ProductField<string[]>) => void;

  placeholder?: string;
  disabled?: boolean;
}

export const ProductChipsInput = forwardRef<
  HTMLInputElement,
  ProductChipsInputProps
>((props, ref) => {
  const { fieldKey, value, onChange, disabled, ...restProps } = props;

  const rawValue = value?.value || null;
  const meta = useMemo(() => value?.meta, [value?.meta]);
  const chips = useMemo(() => rawValue || [], [rawValue]);

  const [inputValue, setInputValue] = useState('');

  const updateValue = useCallback(
    (newValue: string[]) => {
      onChange?.({ value: newValue, meta: { ...meta, fieldKey } });
    },
    [fieldKey, meta, onChange],
  );

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const evt = e as KeyboardEvent<HTMLInputElement>;
      if (evt.key !== 'Enter' && evt.key !== 'Tab') {
        return;
      }

      evt.preventDefault();
      evt.stopPropagation();

      const chipValue = evt.currentTarget.value.trim();
      if (chipValue.length === 0) {
        return;
      }

      const newChips = [...chips];
      newChips.push(chipValue);

      updateValue(newChips);
      setInputValue('');
    },
    [chips, updateValue],
  );

  const handleBlur = useCallback(
    (e: FocusEvent) => {
      const evt = e as FocusEvent<HTMLInputElement>;
      evt.preventDefault();
      evt.stopPropagation();

      const chipValue = evt.currentTarget.value.trim();
      if (chipValue.length === 0) {
        return;
      }

      const newChips = [...chips];
      newChips.push(chipValue);

      updateValue(newChips);
      setInputValue('');
    },
    [chips, updateValue],
  );

  const handleClear = useCallback(
    (i: number) => {
      const newValue = [...chips];
      newValue.splice(i, 1);

      updateValue(newValue);
    },
    [chips, updateValue],
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
            <ProductChip
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
});
ProductChipsInput.displayName = 'ProductChipsInput';

interface ProductChipProps {
  value: string;
  onClear?: () => void;

  disabled?: boolean;
}

export const ProductChip: FunctionComponent<ProductChipProps> = (props) => {
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
