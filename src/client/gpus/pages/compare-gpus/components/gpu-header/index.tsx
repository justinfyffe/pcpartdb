import { getGpuName, getShoppingUrl } from '@client/gpus';
import { GpuImages } from '@client/gpus/components';
import { Button } from '@client/shared/components';
import { Gpu } from '@shared/gpus';
import React, { FunctionComponent } from 'react';

interface GpuHeaderProps {
  gpu: Gpu;
}

export const GpuHeader: FunctionComponent<GpuHeaderProps> = (props) => {
  const { gpu } = props;

  const shoppingUrl = getShoppingUrl(gpu);

  return (
    <div className="flex-1 flex flex-col gap-4 min-w-52.5 justify-end">
      <div className="flex gap-2 items-center justify-between">
        <h2 className="md:text-xl text-2xl mb-0">{getGpuName(gpu)}</h2>

        {shoppingUrl != null && (
          <Button
            href={shoppingUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="bg-green-500 text-white text-xs self-end px-2 py-1"
          >
            Shop
          </Button>
        )}
      </div>

      <GpuImages gpu={gpu} />
    </div>
  );
};
