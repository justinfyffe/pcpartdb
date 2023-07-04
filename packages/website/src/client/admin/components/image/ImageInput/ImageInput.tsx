import { PhotoIcon } from '@heroicons/react/24/outline';
import { Image } from '@pcpartdb/shared';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { formatFileSize, formatImageDimensions } from '../../../../image';
import {
  Button,
  ButtonVariant,
  Img,
  showDialog,
} from '../../../../shared/components';
import { classNames } from '../../../../shared/ui';
import { ImageDialog } from '../ImageDialog';

interface ImageInputProps {
  recommendedHeight?: number;
  recommendedWidth?: number;

  value?: Image;
  onChange?: (image: Image) => void;

  className?: string;
}

export const ImageInput: FunctionComponent<ImageInputProps> = (props) => {
  const { onChange, className, ...restOfProps } = props;
  const [value, setValue] = useState<Image>(props.value);

  const handleSelect = useCallback(
    (image: Image) => {
      setValue(image);
      onChange(image);
    },
    [onChange],
  );

  const handleClear = useCallback(() => {
    setValue(null);
    onChange(null);
  }, [onChange]);

  return (
    <div className={classNames('border-px rounded block', className)}>
      {value != null ? (
        <SelectedImageInput
          {...restOfProps}
          value={value}
          onClear={handleClear}
        />
      ) : (
        <EmptyImageInput {...restOfProps} onSelect={handleSelect} />
      )}
    </div>
  );
};

const SelectedImageInput = (
  props: ImageInputProps & { onClear: () => void },
) => {
  const { value, recommendedHeight, recommendedWidth, onClear } = props;

  return (
    <div className="items-start flex flex-wrap h-full justify-center p-4">
      <Img src={value} className="max-h-62.5 max-w-[calc(100%_+_32px)]" />

      <div className="mx-4">
        <div className="font-medium">{value.name}</div>

        <div className="text-[#aaa] text-2xs my-1">
          {formatFileSize(value.fileSize)} &bull;
          {formatImageDimensions(value.width, value.height)}
          {recommendedHeight && recommendedWidth && (
            <div className="mt-1">
              Recommended:{' '}
              {formatImageDimensions(recommendedWidth, recommendedHeight)}
            </div>
          )}
        </div>

        <Button
          type="button"
          variant={ButtonVariant.Generic}
          onClick={onClear}
          className="mt-5"
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

const EmptyImageInput = (
  props: ImageInputProps & { onSelect: (image: Image) => void },
) => {
  const { recommendedHeight, recommendedWidth, onSelect } = props;

  const handleClick = useCallback(() => {
    showDialog(<ImageDialog onSelect={onSelect} />);
  }, [onSelect]);

  return (
    <div
      className="items-center text-[#ccc] cursor-pointer flex flex-col text-5xl h-full justify-center p-4 w-full"
      onClick={handleClick}
    >
      <PhotoIcon className="w-18 h-18 mb-2" />
      No Image
      {recommendedHeight && recommendedWidth && (
        <div className="text-2xs mt-2">
          Recommended:{' '}
          {formatImageDimensions(recommendedWidth, recommendedHeight)}
        </div>
      )}
    </div>
  );
};
