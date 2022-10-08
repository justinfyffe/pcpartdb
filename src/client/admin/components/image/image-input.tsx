import { formatDimensions, formatFileSize } from '@client/image';
import {
  Button,
  ButtonVariant,
  Img,
  showDialog,
} from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import { PhotographIcon } from '@heroicons/react/outline';
import { Image } from '@shared/image';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { ImageDialog } from './image-dialog';

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
    <div
      className={classNames(
        'border-[1px] border-slate-300 border-solid rounded block',
        className,
      )}
    >
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
      <Img src={value} className="max-h-[250px] max-w-[calc(100%_+_32px)]" />

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
