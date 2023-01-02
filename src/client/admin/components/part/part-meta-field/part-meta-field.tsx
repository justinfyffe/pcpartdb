import { PartMeta, PartMetaKey } from '@shared/part-meta';
import React, {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { PartMetaStringField } from './part-meta-string-field';
import { PartMetaTextField } from './part-meta-text-field';

type InputType = 'string' | 'text';

const INPUT_TYPES: Record<string, InputType> = {
  description: 'text',
};

interface PartMetaFieldProps {
  type?: InputType;
  field: PartMetaKey;

  value?: PartMeta;
  onChange?: (value: PartMeta) => void;
}

export const PartMetaField = forwardRef<unknown, PartMetaFieldProps>(
  (props, ref) => {
    const { type, field, value: propsValue, onChange } = props;

    const [value, setValue] = useState(propsValue ?? null);
    useEffect(() => setValue(propsValue), [propsValue]);

    const handleChange = useCallback(
      (value: PartMeta) => {
        setValue(value);
        onChange?.(value);
      },
      [onChange],
    );

    const inputType = type ?? INPUT_TYPES[field];
    if (inputType === 'text') {
      return (
        <PartMetaTextField
          field={field}
          value={value as PartMeta<string>}
          onChange={handleChange}
          ref={ref as Ref<HTMLTextAreaElement>}
        />
      );
    } else if (inputType === 'string') {
      return (
        <PartMetaStringField
          field={field}
          value={value as PartMeta<string>}
          onChange={handleChange}
          ref={ref as Ref<HTMLInputElement>}
        />
      );
    } else {
      return (
        <PartMetaStringField
          field={field}
          value={value as PartMeta<string>}
          onChange={handleChange}
          ref={ref as Ref<HTMLInputElement>}
        />
      );
    }
  },
);
PartMetaField.displayName = 'PartMetaField';
