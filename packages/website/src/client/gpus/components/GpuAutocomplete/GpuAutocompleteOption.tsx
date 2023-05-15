import { Gpu } from '@pcpartdb/shared';
import React, { FunctionComponent, useMemo } from 'react';
import { getCompanyLogoAutocompletePath } from '../../../image';
import { AutocompleteOption, Img } from '../../../shared/components';
import { DateFormatter } from '../../../shared/format';
import { formatGpuField, getGpuName } from '../..';

interface GpuAutocompleteOptionProps {
  index: number;
  gpu: Gpu;
}

export const GpuAutocompleteOption: FunctionComponent<
  GpuAutocompleteOptionProps
> = (props) => {
  const { index, gpu } = props;

  const id = gpu.id;
  const name = useMemo(() => getGpuName(gpu), [gpu]);
  const shortName = useMemo(() => getGpuName(gpu, { company: false }), [gpu]);
  const image = useMemo(() => getCompanyLogoAutocompletePath(gpu), [gpu]);

  const marketSegmentAndChipset = useMemo(() => {
    const marketSegment = formatGpuField(gpu.marketSegment);
    const chipset = getGpuName(gpu.chipset, { company: false });
    return [marketSegment, chipset].filter((value) => value != null).join(', ');
  }, [gpu.marketSegment, gpu.chipset]);
  const releaseDate = useMemo(
    () =>
      formatGpuField(gpu.releaseDate, {
        dateFormatter: DateFormatter.QuarterYear,
      }),
    [gpu.releaseDate],
  );
  const price = useMemo(
    () => formatGpuField(gpu.launchPrice),
    [gpu.launchPrice],
  );

  return (
    <AutocompleteOption index={index} label={shortName} value={`${id}`}>
      <div className="flex flex-1 items-center gap-4">
        <div className="w-8">{image != null ? <Img src={image} /> : <></>}</div>

        <div className="flex flex-1 flex-col gap-1 items-start">
          <span className="flex-1 text-sm">{name}</span>
          <span className="flex-1 text-2xs text-[#aaa]">
            {marketSegmentAndChipset}
          </span>
        </div>

        <div className="flex flex-col gap-1 items-end text-2xs">
          <div className="text-[#aaa]">{releaseDate}</div>
          <div className="text-[#aaa]">{price}</div>
        </div>
      </div>
    </AutocompleteOption>
  );
};
