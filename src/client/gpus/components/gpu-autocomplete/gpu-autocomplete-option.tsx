import { formatGpuSpec, getGpuName } from '@client/gpus';
import { getCompanyLogoImagePath } from '@client/image';
import { AutocompleteOption, Img } from '@client/shared/components';
import { DateFormatter } from '@client/shared/format';
import { Gpu } from '@shared/gpus';
import React, { FunctionComponent } from 'react';

interface GpuAutocompleteOptionProps {
  index: number;
  gpu: Gpu;
}

export const GpuAutocompleteOption: FunctionComponent<
  GpuAutocompleteOptionProps
> = (props) => {
  const { index, gpu } = props;

  const id = gpu.id;
  const name = getGpuName(gpu, { company: false });
  const image = getCompanyLogoImagePath(gpu);

  const releaseDate = formatGpuSpec(gpu.specs?.releaseDate, {
    dateFormatter: DateFormatter.Year,
  });
  const price = formatGpuSpec(gpu.specs?.launchPrice);

  return (
    <AutocompleteOption index={index} label={name} value={`${id}`}>
      <div className="flex flex-1 items-center gap-4">
        {image != null ? <Img src={image} className="h-5" /> : <></>}
        <span className="flex-1 text-sm">{getGpuName(gpu)}</span>
        <div className="flex flex-col gap-1 items-end text-2xs">
          <div className="text-[#aaa]">{releaseDate}</div>
          <div className="text-[#aaa]">{price}</div>
        </div>
      </div>
    </AutocompleteOption>
  );
};
