import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { GpuImage, GpuImages } from '@pcpartdb/shared/gpus';
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button, ButtonVariant } from '../../../../shared/components';
import { GpuImageInput } from './gpu-image-input';

interface GpuImagesInputProps {
  name: string;
  value: GpuImages;

  onChange: (values: GpuImages) => void;

  ref?: unknown;
}

export const GpuImagesInput: FunctionComponent<GpuImagesInputProps> = (
  props,
) => {
  const { value, onChange } = props;
  const emptyValue = useMemo(() => [] as GpuImages, []);

  // TODO: this could probably be made into a hook
  const [rowKeys] = useState(() => {
    const ret: string[] = [];
    value?.forEach(() => ret.push(uuidv4()));
    return ret;
  });

  const handleImageChange = useCallback(
    (i: number, image: GpuImage) => {
      const newValue: GpuImages = value != null ? [...value] : emptyValue;
      newValue[i] = image != null ? { imageId: image.imageId } : null;
      onChange(newValue);
    },
    [emptyValue, value, onChange],
  );

  const handleAppend = useCallback(() => {
    const newValue: GpuImages = value != null ? [...value] : emptyValue;
    rowKeys.push(uuidv4());
    newValue.push(null);
    onChange(newValue);
  }, [rowKeys, emptyValue, value, onChange]);

  const handleShiftUp = useCallback(
    (i: number) => {
      const newValue: GpuImages = [...value];

      // Swap values and row keys
      [newValue[i], newValue[i - 1]] = [newValue[i - 1], newValue[i]];
      [rowKeys[i], rowKeys[i - 1]] = [rowKeys[i - 1], rowKeys[i]];

      onChange(newValue);
    },
    [rowKeys, value, onChange],
  );

  const handleShiftDown = useCallback(
    (i: number) => {
      const newValue: GpuImages = [...value];

      // Swap values and row keys
      [newValue[i], newValue[i + 1]] = [newValue[i + 1], newValue[i]];
      [rowKeys[i], rowKeys[i + 1]] = [rowKeys[i + 1], rowKeys[i]];

      onChange(newValue);
    },
    [rowKeys, value, onChange],
  );

  const handleRemove = useCallback(
    (i: number) => {
      const newValue: GpuImages = [...value];
      newValue.splice(i, 1);
      rowKeys.splice(i, 1);
      onChange(newValue.length > 0 ? newValue : null);
    },
    [rowKeys, value, onChange],
  );

  return (
    <div className="flex flex-col w-full mb-6">
      {value?.map((image, i) => (
        <div key={rowKeys[i]} className="flex items-stretch mb-6">
          <div className="mx-6 text-3xl self-center">{i + 1}</div>

          <GpuImageInput
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
                disabled={i === value.length - 1}
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
