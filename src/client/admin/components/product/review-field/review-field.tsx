import { Field, NumberInput, TextInput } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import { Review, ReviewKey } from '@shared/review';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';

const LABELS: Record<string, string> = {
  amazon: 'Amazon',
  pcGamer: 'PC Gamer',
  techRadar: 'Tech Radar',
  techSpot: 'Tech Spot',
  tomsHardware: "Tom's Hardware",
};

interface ReviewFieldProps {
  field: ReviewKey;

  value?: Review<number>;
  onChange?: (value: Review<number>) => void;

  className?: string;
  ref?: unknown;
}

export const ReviewField: FunctionComponent<ReviewFieldProps> = (props) => {
  const { field, value: propsValue, onChange, className } = props;

  const [value, setValue] = useState(propsValue || null);
  useEffect(() => setValue(propsValue), [propsValue]);

  const handleScoreChange = useCallback(
    (score: number) => {
      const newValue: Review<number> = {
        ...value,
        value: score,
        metadata: { reviewKey: field },
      };
      setValue(newValue);
      onChange(newValue);
    },
    [field, onChange, value],
  );

  const handleSourceChange = useCallback(
    (source: string) => {
      const newValue: Review<number> = {
        ...value,
        source,
        metadata: { reviewKey: field },
      };
      setValue(newValue);
      onChange(newValue);
    },
    [field, onChange, value],
  );

  return (
    <div className={classNames('flex gap-6 items-center', className)}>
      <div className="flex-1 max-w-[200px]">{LABELS[field] ?? '--'}</div>

      <Field className="flex-1">
        Score
        <NumberInput
          value={value?.value ?? null}
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
