import {
  getCompanyLogoImagePath,
  getImagePath,
} from '@pcpartdb/website/client/image';
import { Img } from '@pcpartdb/website/client/shared/components';
import { classNames } from '@pcpartdb/website/client/shared/ui';
import { Gpu } from '@pcpartdb/website/shared/gpus';
import React, { FunctionComponent, useMemo, useState } from 'react';
import { GpuImageOption } from './gpu-image-option';

interface GpuImagesProps {
  gpu: Gpu;

  className?: string;
}

export const GpuImages: FunctionComponent<GpuImagesProps> = (props) => {
  const { gpu, className } = props;

  const [selected, setSelected] = useState(0);

  const images = useMemo(() => {
    const gpuImages = gpu.images ?? [];
    const companyImage = getCompanyLogoImagePath(gpu);
    const images = gpuImages
      .filter((image) => image?.image != null)
      .map(({ image }) => getImagePath(image));

    if (companyImage != null) {
      images.push(companyImage);
    }

    return images;
  }, [gpu]);

  if (images.length === 0) {
    return <></>;
  }

  return (
    <div
      className={classNames(
        'flex flex-col gap-3 mx-auto items-start justify-start w-full',
        className,
      )}
    >
      <div className="bg-slate-50 flex items-center justify-center rounded w-full h-80 p-4">
        <Img
          className="mx-auto h-auto max-h-full w-auto"
          src={images[selected]}
        />
      </div>

      <div className="flex flex-wrap w-full gap-4">
        {images.map((image, i) => (
          <GpuImageOption
            key={i}
            src={image}
            onClick={() => setSelected(i)}
            className={selected === i ? 'border-px border-black' : ''}
          />
        ))}
      </div>
    </div>
  );
};
