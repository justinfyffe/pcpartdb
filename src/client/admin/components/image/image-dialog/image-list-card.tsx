import { formatDimensions, formatFileSize } from '@client/image';
import { Card, Img, TextInput } from '@client/shared/components';
import { Image } from '@shared/image';
import React, { FunctionComponent, useCallback } from 'react';

interface ImageListCardProps {
  image: Image;
  hidePath?: boolean;
  onClick?: (image: Image) => void;
}

export const ImageListCard: FunctionComponent<ImageListCardProps> = (props) => {
  const { image, hidePath = false, onClick } = props;

  const handleClick = useCallback(
    (image: Image) => {
      onClick?.(image);
    },
    [onClick],
  );

  return (
    <div className="h-full" onClick={() => handleClick(image)}>
      <Card className="h-full gap-2 justify-end">
        <Img
          src={image}
          alt={image.name}
          className="self-center max-h-64 max-w-[calc(100%_+_32px)]"
        />

        <div className="text-center">{image.name}</div>
        {!hidePath && (
          <TextInput value={image.path} className="my-2" disabled />
        )}

        <div className="text-[#aaa] flex text-2xs justify-between m-[0_-12px_-12px]">
          <span>{formatFileSize(image.fileSize)}</span>
          <span>{formatDimensions(image.width, image.height)}</span>
        </div>
      </Card>
    </div>
  );
};
