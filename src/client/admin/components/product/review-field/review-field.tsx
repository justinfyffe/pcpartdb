import { Field, NumberInput, TextInput } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import { ReviewKey, ReviewRequest } from '@shared/review';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';

const LABELS: Record<ReviewKey, string> = {
  [ReviewKey.Amazon]: 'Amazon',
  [ReviewKey.PcGamer]: 'PC Gamer',
  [ReviewKey.TechRadar]: 'Tech Radar',
  [ReviewKey.TechSpot]: 'Tech Spot',
  [ReviewKey.TomsHardware]: "Tom's Hardware",
};

interface ReviewFieldProps {
  reviewKey: ReviewKey;

  value?: ReviewRequest;
  onChange?: (value: ReviewRequest) => void;

  className?: string;
  ref?: unknown;
}

export const ReviewField: FunctionComponent<ReviewFieldProps> = (props) => {
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
      <div className="flex-1 max-w-[200px]">{LABELS[reviewKey] ?? '--'}</div>

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
