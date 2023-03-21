import React, { FunctionComponent } from 'react';
import { Img } from '../../../shared/components';
import { classNames } from '../../../shared/ui';

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
