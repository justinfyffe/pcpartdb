import { Field, NumberInput, TextInput } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import { ProductReviewKey, ProductReviewRequest } from '@shared/product-review';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';

const LABELS: Record<ProductReviewKey, string> = {
  [ProductReviewKey.Amazon]: 'Amazon',
  [ProductReviewKey.PcGamer]: 'PC Gamer',
  [ProductReviewKey.TechRadar]: 'Tech Radar',
  [ProductReviewKey.TechSpot]: 'Tech Spot',
  [ProductReviewKey.TomsHardware]: "Tom's Hardware",
};

interface ProductReviewFieldProps {
  reviewKey: ProductReviewKey;

  value?: ProductReviewRequest;
  onChange?: (value: ProductReviewRequest) => void;

  className?: string;
  ref?: unknown;
}

export const ProductReviewField: FunctionComponent<ProductReviewFieldProps> = (
  props,
) => {
  const { reviewKey, value: propsValue, onChange, className } = props;

  const [value, setValue] = useState(propsValue ?? null);
  useEffect(() => setValue(propsValue), [propsValue]);

  const handleScoreChange = useCallback(
    (score: number) => {
      const newValue = { ...value, floatValue: score };
      setValue(newValue);
      onChange(newValue);
    },
    [onChange, value],
  );

  const handleSourceChange = useCallback(
    (source: string) => {
      const newValue = { ...value, source };
      setValue(newValue);
      onChange(newValue);
    },
    [onChange, value],
  );

  return (
    <div className={classNames('flex gap-6 items-center', className)}>
      <Field className="flex-1">
        Review
        <div className="block">{LABELS[reviewKey] ?? '--'}</div>
      </Field>

      <Field className="flex-1">
        Score
        <NumberInput
          value={value?.floatValue ?? null}
          onChange={handleScoreChange}
          ref={null}
        />
      </Field>

      <Field className="flex-1">
        Source
        <TextInput
          value={value?.source ?? null}
          onChange={handleSourceChange}
          ref={null}
        />
      </Field>
    </div>
  );
};
