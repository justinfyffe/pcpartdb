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
      <Card className="h-full gap-2">
        <Img
          src={image}
          alt={image.name}
          className="self-center max-h-[250px] max-w-[calc(100%_+_32px)]"
        />

        <div className="text-center">{image.name}</div>
        {!hidePath && (
          <TextInput value={image.path} className="m-[8px_0]" disabled />
        )}

        <div className="text-[#aaa] flex text-[12px] justify-between m-[0_-12px_-12px]">
          <span>{formatFileSize(image.fileSize)}</span>
          <span>{formatDimensions(image.width, image.height)}</span>
        </div>
      </Card>
    </div>
  );
};
