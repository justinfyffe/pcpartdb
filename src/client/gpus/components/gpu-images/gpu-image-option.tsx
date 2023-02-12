import { Img } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import React, { FunctionComponent } from 'react';

interface GpuImageOptionProps {
  src: string;
  onClick: () => void;
  className?: string;
}

export const GpuImageOption: FunctionComponent<GpuImageOptionProps> = (
  props,
) => {
  const { src, className, onClick } = props;

  return (
    <div
      className={classNames(
        'bg-gray-50 border-px border-transparent flex items-center h-15 w-15 cursor-pointer overflow-hidden',
        className,
      )}
      onClick={onClick}
    >
      <Img className="h-auto mx-auto w-auto" src={src} />
    </div>
  );
};
