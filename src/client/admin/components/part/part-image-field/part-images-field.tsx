import { Button, ButtonVariant } from '@client/shared/components';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { PartImage } from '@shared/part-image';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { PartImageField } from './part-image-field';

interface PartImagesFieldProps {
  name: string;
  value: PartImage[];

  onChange: (values: PartImage[]) => void;

  ref?: unknown;
}

export const PartImagesField: FunctionComponent<PartImagesFieldProps> = (
  props,
) => {
  const { value: propsValue, onChange } = props;

  const [value, setValue] = useState(propsValue || []);
  useEffect(() => setValue(propsValue || []), [propsValue]);

  const handleImageChange = useCallback(
    (i: number, partImage: PartImage) => {
      value[i] = {
        imageId: partImage.imageId,
        metadata: partImage.metadata,
      };
      onChange(value);
    },
    [value, onChange],
  );

  const handleAppend = useCallback(() => {
    value.push(null);
    onChange(value);
  }, [value, onChange]);

  const handleShiftUp = useCallback(
    (i: number) => {
      const tmp = value[i];
      value[i] = value[i - 1];
      value[i - 1] = tmp;
      onChange(value);
    },
    [value, onChange],
  );

  const handleShiftDown = useCallback(
    (i: number) => {
      const tmp = value[i];
      value[i] = value[i + 1];
      value[i + 1] = tmp;
      onChange(value);
    },
    [value, onChange],
  );

  const handleRemove = useCallback(
    (i: number) => {
      value.splice(i, 1);
      onChange(value);
    },
    [value, onChange],
  );

  return (
    <div className="flex flex-col w-full mb-6">
      {value.map((image, i) => (
        <div key={i} className="flex items-stretch mb-6">
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
                disabled={i === value.length - 1}
                onClick={() => handleShiftDown(i)}
              >
                {' '}
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
