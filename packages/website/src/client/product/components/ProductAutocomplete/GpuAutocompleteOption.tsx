import {
  DateFormat,
  formatGpuField,
  formatGpuName,
  Gpu,
} from '@pcpartdb/shared';
import React, { FunctionComponent, useMemo } from 'react';
import { getCompanyLogoAutocompletePath } from '../../../image';
import { AutocompleteOption } from '../../../shared/components';
import { Img } from '../../../shared/components/Img/Img';

interface GpuAutocompleteOptionProps {
  index: number;
  gpu: Gpu;
}

export const GpuAutocompleteOption: FunctionComponent<
  GpuAutocompleteOptionProps
> = (props) => {
  const { index, gpu } = props;

  const id = gpu.id;
  const name = useMemo(() => formatGpuName(gpu, { company: false }), [gpu]);
  const shortName = useMemo(
    () => formatGpuName(gpu, { company: false }),
    [gpu],
  );
  const image = useMemo(() => getCompanyLogoAutocompletePath(gpu), [gpu]);
  const company = useMemo(() => formatGpuField(gpu.company), [gpu]);

  const companyAndMarketSegment = useMemo(() => {
    const marketSegment = formatGpuField(gpu.marketSegment);
    return [company, marketSegment].filter((value) => value != null).join(', ');
  }, [company, gpu.marketSegment]);
  const releaseDate = useMemo(
    () =>
      formatGpuField(gpu.releaseDate, {
        dateFormat: DateFormat.QuarterYear,
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
        <div className="w-8">
          {image != null ? <Img src={image} alt={company} /> : <></>}
        </div>

        <div className="flex flex-1 flex-col gap-1 items-start">
          <span className="flex-1 text-base">{name}</span>
          <span className="flex-1 text-sm text-dimmed">
            {companyAndMarketSegment}
          </span>
        </div>

        <div className="flex flex-col gap-1 items-end text-sm">
          <div className="text-dimmed">{releaseDate}</div>
          <div className="text-dimmed">{price}</div>
        </div>
      </div>
    </AutocompleteOption>
  );
};
