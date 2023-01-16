import { Button, ButtonVariant } from '@client/shared/components';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { PartMeta } from '@shared/part-meta';
import { RetailModel } from '@shared/retail-model';
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { RetailModelField } from './retail-model-field';

interface RetailModelsFieldProps {
  value?: PartMeta<RetailModel[]>;

  onChange?: (value: PartMeta<RetailModel[]>) => void;

  className?: string;
  ref?: unknown;
}

export const RetailModelsField: FunctionComponent<RetailModelsFieldProps> = (
  props,
) => {
  const { value, onChange } = props;
  const emptyValue = useMemo(
    () => ({ value: [] } as PartMeta<RetailModel[]>),
    [],
  );

  const [rowKeys] = useState(() => {
    const ret: string[] = [];
    value?.value?.forEach(() => ret.push(uuidv4()));
    return ret;
  });

  const handleChange = useCallback(
    (i: number, retailModel: RetailModel) => {
      const newValue = value != null ? { ...value } : emptyValue;
      newValue.value[i] = retailModel;
      onChange(newValue);
    },
    [emptyValue, value, onChange],
  );

  const handleAppend = useCallback(() => {
    const newValue = value != null ? { ...value } : emptyValue;
    rowKeys.push(uuidv4());
    newValue.value.push(null);
    onChange(newValue);
  }, [rowKeys, emptyValue, value, onChange]);

  const handleShiftUp = useCallback(
    (i: number) => {
      const newValue = { ...value };

      // Swap values and row keys
      [newValue.value[i], newValue.value[i - 1]] = [
        newValue.value[i - 1],
        newValue.value[i],
      ];
      [rowKeys[i], rowKeys[i - 1]] = [rowKeys[i - 1], rowKeys[i]];

      onChange(newValue);
    },
    [rowKeys, value, onChange],
  );

  const handleShiftDown = useCallback(
    (i: number) => {
      const newValue = { ...value };

      // Swap values and row keys
      [newValue.value[i], newValue.value[i + 1]] = [
        newValue.value[i + 1],
        newValue.value[i],
      ];
      [rowKeys[i], rowKeys[i + 1]] = [rowKeys[i + 1], rowKeys[i]];

      onChange(newValue);
    },
    [rowKeys, value, onChange],
  );

  const handleRemove = useCallback(
    (i: number) => {
      const newValue = { ...value };
      newValue.value.splice(i, 1);
      rowKeys.splice(i, 1);
      onChange(newValue.value.length > 0 ? newValue : null);
    },
    [rowKeys, value, onChange],
  );

  return (
    <div className="flex flex-col w-full mb-6">
      {value?.value.map((retailModel, i) => (
        <div key={rowKeys[i]} className="flex items-stretch">
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
              className="h-11.5"
            >
              <ChevronUpIcon className="w-4" />
            </Button>
            <Button
              variant={ButtonVariant.Default}
              disabled={i === value.value.length - 1}
              onClick={() => handleShiftDown(i)}
              className="h-11.5"
            >
              <ChevronDownIcon className="w-4" />
            </Button>
            <Button
              variant={ButtonVariant.Default}
              onClick={() => handleRemove(i)}
              className="h-11.5"
            >
              <XMarkIcon className="w-4" />
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
