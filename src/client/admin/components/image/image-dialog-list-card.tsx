import React, { FunctionComponent, useCallback } from 'react';
import { Image } from '../../../../shared/image';
import { formatDimensions, formatFileSize } from '../../../image/image.utils';
import { Card, CardContent } from '../../../shared/components/card';
import { Img } from '../../../shared/components/image';
import { TextInput } from '../../../shared/components/input';

interface ImageDialogListCardProps {
  image: Image;
  hidePath?: boolean;
  onClick?: (image: Image) => void;
}

export const ImageDialogListCard: FunctionComponent<
  ImageDialogListCardProps
> = (props) => {
  const { image, hidePath = false, onClick } = props;

  const handleClick = useCallback(
    (image: Image) => {
      onClick?.(image);
    },
    [onClick],
  );

  return (
    <div className="h-full" onClick={() => handleClick(image)}>
      <Card className="h-full">
        <Img
          src={image}
          alt={image.name}
          className="self-center m-[-12px_-16px_0px] max-h-[250px] max-w-[calc(100%_+_32px)]"
        />

        <CardContent className="m-[8px_0_0]">
          <div className="text-center">{image.name}</div>
          {!hidePath && (
            <TextInput value={image.path} className="m-[8px_0]" disabled />
          )}

          <div className="text-[#aaa] flex text-[12px] justify-between m-[12px_-12px_-12px]">
            <span>{formatFileSize(image.fileSize)}</span>
            <span>{formatDimensions(image.width, image.height)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
