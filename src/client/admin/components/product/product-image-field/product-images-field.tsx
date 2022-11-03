import { Button, ButtonVariant } from '@client/shared/components';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { ProductImage } from '@shared/product-image';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { ProductImageField } from './product-image-field';

interface ProductImagesFieldProps {
  name: string;
  value: ProductImage[];

  onChange: (values: ProductImage[]) => void;

  ref?: unknown;
}

export const ProductImagesField: FunctionComponent<ProductImagesFieldProps> = (
  props,
) => {
  const { value: propsValue, onChange } = props;

  const [value, setValue] = useState(propsValue || []);
  useEffect(() => setValue(propsValue), [propsValue]);

  const handleImageChange = useCallback(
    (i: number, productImage: ProductImage) => {
      value[i] = {
        imageId: productImage.imageId,
        metadata: productImage.metadata,
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

          <ProductImageField
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
                <ChevronUpIcon className="w-[16px]" />
              </Button>
              <Button
                variant={ButtonVariant.Default}
                disabled={i === value.length - 1}
                onClick={() => handleShiftDown(i)}
              >
                {' '}
                <ChevronDownIcon className="w-[16px]" />
              </Button>
            </div>
            <div>
              <Button
                variant={ButtonVariant.Default}
                onClick={() => handleRemove(i)}
              >
                <XMarkIcon className="w-[16px]" />
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
