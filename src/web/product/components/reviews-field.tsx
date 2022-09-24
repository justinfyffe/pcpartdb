import { XIcon } from '@heroicons/react/outline';
import React, { FunctionComponent, useCallback } from 'react';
import { ProductReviewKey } from '../../../types/product-review';
import { Button, ButtonVariant } from '../../shared/components/button';
import { Field } from '../../shared/components/field';
import { TextInput } from '../../shared/components/input';
import {
  Select,
  SelectOption,
  SelectValue,
} from '../../shared/components/select';

interface ReviewValue {
  key: ProductReviewKey;
  value: string;
  source: string;
}

interface ReviewsFieldProps {
  name: string;
  value: ReviewValue[];
  fields: (ReviewValue & { id: string })[];

  onChange: (values: ReviewValue[]) => void;
  onAppend: () => void;
  onRemove: (index: number) => void;

  ref?: unknown;
}

export const ReviewsField: FunctionComponent<ReviewsFieldProps> = (props) => {
  const { fields, value, onAppend, onChange, onRemove } = props;

  const handleFieldChange = useCallback(
    (i: number, review: ReviewValue) => {
      fields[i] = { ...fields[i], ...review };
      value[i] = { ...review };
      onChange(value);
    },
    [fields, value, onChange],
  );

  return (
    <div className="flex flex-col w-full mb-6">
      {fields.map((benchmark, i) => (
        <ReviewField
          key={benchmark.id}
          value={benchmark}
          onChange={(value) => handleFieldChange(i, value)}
          onRemove={() => onRemove(i)}
        />
      ))}

      <Button
        className="self-end"
        variant={ButtonVariant.Secondary}
        onClick={() => onAppend && onAppend()}
      >
        Add Review
      </Button>
    </div>
  );
};

interface ReviewFieldProps {
  value: ReviewValue;

  onChange: (benchmark: ReviewValue) => void;
  onRemove: () => void;
}

const ReviewField: FunctionComponent<ReviewFieldProps> = (props) => {
  const { value, onChange, onRemove } = props;

  const handleKeyChange = useCallback(
    (key: SelectValue) => {
      onChange({ ...value, key: key as unknown as ProductReviewKey });
    },
    [onChange, value],
  );

  const handleRatingChange = useCallback(
    (rating: string) => {
      onChange({ ...value, value: rating });
    },
    [onChange, value],
  );

  const handleSourceChange = useCallback(
    (source: string) => {
      onChange({ ...value, source });
    },
    [onChange, value],
  );

  return (
    <div className="flex gap-6 items-center">
      <Field className="flex-1">
        Review
        <Select value={value.key} onChange={handleKeyChange}>
          <SelectOption
            label="Tom's Hardware"
            value={ProductReviewKey.TomsHardware}
          >
            Tom&apos;s Hardware
          </SelectOption>
        </Select>
      </Field>

      <Field className="flex-1">
        Rating
        <TextInput
          value={value.value}
          onChange={handleRatingChange}
          ref={null}
        />
      </Field>

      <Field className="flex-1">
        Source
        <TextInput
          value={value.source}
          onChange={handleSourceChange}
          ref={null}
        />
      </Field>

      <Button
        className="w-[46px] h-[46px] mb-6"
        variant={ButtonVariant.Default}
        onClick={onRemove}
      >
        <XIcon className="w-[16px]" />
      </Button>
    </div>
  );
};
