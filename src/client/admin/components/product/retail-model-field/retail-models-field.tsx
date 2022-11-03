import { Button, ButtonVariant } from '@client/shared/components';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { ProductMeta } from '@shared/product-meta';
import { RetailModel } from '@shared/retail-model';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { RetailModelField } from './retail-model-field';

interface RetailModelsFieldProps {
  value?: ProductMeta<RetailModel[]>;

  onChange?: (value: ProductMeta<RetailModel[]>) => void;

  className?: string;
  ref?: unknown;
}

export const RetailModelsField: FunctionComponent<RetailModelsFieldProps> = (
  props,
) => {
  const { value: propsValue, onChange } = props;

  const [value, setValue] = useState(propsValue || { value: [] });
  useEffect(() => setValue(propsValue), [propsValue]);

  const handleChange = useCallback(
    (i: number, retailModel: RetailModel) => {
      value.value[i] = retailModel;
      onChange(value);
    },
    [value, onChange],
  );

  const handleAppend = useCallback(() => {
    value.value.push(null);
    onChange(value);
  }, [value, onChange]);

  const handleShiftUp = useCallback(
    (i: number) => {
      const tmp = value.value[i];
      value.value[i] = value.value[i - 1];
      value.value[i - 1] = tmp;
      onChange(value);
    },
    [value, onChange],
  );

  const handleShiftDown = useCallback(
    (i: number) => {
      const tmp = value.value[i];
      value.value[i] = value.value[i + 1];
      value.value[i + 1] = tmp;
      onChange(value);
    },
    [value, onChange],
  );

  const handleRemove = useCallback(
    (i: number) => {
      value.value.splice(i, 1);
      onChange(value);
    },
    [value, onChange],
  );

  return (
    <div className="flex flex-col w-full mb-6">
      {value.value.map((retailModel, i) => (
        <div key={i} className="flex items-stretch">
          <div className="mx-6 text-3xl self-center">{i + 1}</div>

          <RetailModelField
            value={retailModel}
            onChange={(value) => handleChange(i, value)}
            className="flex-1 mb-0"
          />

          <div className="flex gap-3 mx-6 items-center">
            <Button
              variant={ButtonVariant.Default}
              disabled={i === 0}
              onClick={() => handleShiftUp(i)}
              className="h-[46px]"
            >
              <ChevronUpIcon className="w-[16px]" />
            </Button>
            <Button
              variant={ButtonVariant.Default}
              disabled={i === value.value.length - 1}
              onClick={() => handleShiftDown(i)}
              className="h-[46px]"
            >
              {' '}
              <ChevronDownIcon className="w-[16px]" />
            </Button>
            <Button
              variant={ButtonVariant.Default}
              onClick={() => handleRemove(i)}
              className="h-[46px]"
            >
              <XMarkIcon className="w-[16px]" />
            </Button>
          </div>
        </div>
      ))}

      <Button
        className="self-end"
        variant={ButtonVariant.Secondary}
        onClick={() => handleAppend()}
      >
        Add Retail Model
      </Button>
    </div>
  );
};
