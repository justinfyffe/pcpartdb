import { Button, ButtonVariant } from '@client/shared/components';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { PartImage } from '@shared/part-image';
import { PartMeta } from '@shared/part-meta';
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PartImageField } from './part-image-field';

interface PartImagesFieldProps {
  name: string;
  value: PartMeta<PartImage[]>;

  onChange: (values: PartMeta<PartImage[]>) => void;

  ref?: unknown;
}

export const PartImagesField: FunctionComponent<PartImagesFieldProps> = (
  props,
) => {
  const { value, onChange } = props;
  const emptyValue = useMemo(
    () => ({ value: [] } as PartMeta<PartImage[]>),
    [],
  );

  const [rowKeys] = useState(() => {
    const ret: string[] = [];
    value?.value?.forEach(() => ret.push(uuidv4()));
    return ret;
  });

  const handleImageChange = useCallback(
    (i: number, partImage: PartImage) => {
      const newValue = value != null ? { ...value } : emptyValue;
      newValue.value[i] =
        partImage != null
          ? {
              id: partImage.id,
              metadata: partImage.metadata,
            }
          : null;
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
      {value?.value.map((image, i) => (
        <div key={rowKeys[i]} className="flex items-stretch mb-6">
          <div className="mx-6 text-3xl self-center">{i + 1}</div>

          <PartImageField
            value={image}
            onChange={(value) => handleImageChange(i, value)}
            className="flex-1 mb-0"
          />

          <div className="flex flex-col gap-2 mx-2 justify-between">
            <div className="flex flex-col gap-2">
              <Button
                variant={ButtonVariant.Default}
                disabled={i === 0}
                onClick={() => handleShiftUp(i)}
              >
                <ChevronUpIcon className="w-4" />
              </Button>
              <Button
                variant={ButtonVariant.Default}
                disabled={i === value.value.length - 1}
                onClick={() => handleShiftDown(i)}
              >
                <ChevronDownIcon className="w-4" />
              </Button>
            </div>
            <div>
              <Button
                variant={ButtonVariant.Default}
                onClick={() => handleRemove(i)}
              >
                <XMarkIcon className="w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      <Button
        className="self-end"
        variant={ButtonVariant.Secondary}
        onClick={() => handleAppend()}
      >
        Add Image
      </Button>
    </div>
  );
};
