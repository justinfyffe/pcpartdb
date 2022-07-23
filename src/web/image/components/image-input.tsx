import { PhotographIcon } from '@heroicons/react/outline';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { Image } from '../../../types/image';
import { Button, ButtonVariant } from '../../shared/components/button';
import { showDialog } from '../../shared/components/dialog';
import { Img } from '../../shared/components/image';
import { formatDimensions, formatFileSize } from '../image.utils';
import { ImageDialog } from './image-dialog';

interface ImageInputProps {
  recommendedHeight?: number;
  recommendedWidth?: number;

  value?: Image;
  onChange?: (image: Image) => void;
}

export const ImageInput: FunctionComponent<ImageInputProps> = (props) => {
  const { onChange } = props;
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
    <div className="border-[1px] border-[#ccc] border-solid rounded block">
      {value != null ? (
        <SelectedImageInput {...props} value={value} onClear={handleClear} />
      ) : (
        <EmptyImageInput {...props} onSelect={handleSelect} />
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
      <Img src={value} />
      <div className="mx-4">
        <div className="font-medium">{value.name}</div>
        <div className="text-[#aaa] text-[12px] my-1">
          {formatFileSize(value.fileSize)} &bull;
          {formatDimensions(value.width, value.height)}
          {recommendedHeight && recommendedWidth && (
            <div className="mt-1">
              Recommended:{' '}
              {formatDimensions(recommendedWidth, recommendedHeight)}
            </div>
          )}
        </div>
        <Button
          type="button"
          variant={ButtonVariant.Default}
          onClick={onClear}
          className="mt-[20px]"
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
      className="items-center text-[#ccc] cursor-pointer flex flex-col text-[36px] h-full justify-center p-4 w-full"
      onClick={handleClick}
    >
      <PhotographIcon className="w-[72px] h-[72px] mb-2" />
      No Image
      {recommendedHeight && recommendedWidth && (
        <div className="text-[12px] mt-2">
          Recommended: {formatDimensions(recommendedWidth, recommendedHeight)}
        </div>
      )}
    </div>
  );
};
