import {
  formatCompanyName,
  formatProductName,
  GpuProduct,
  productFieldFormattedValue,
} from '@pcpartdb/shared';
import React, { FunctionComponent, useMemo } from 'react';
import { getCompanyLogoAutocompletePath } from '../../../image/utils';
import { AutocompleteOption } from '../../../shared/components/Autocomplete/AutocompleteOption';
import { Img } from '../../../shared/components/Img/Img';

interface GpuAutocompleteOptionProps {
  index: number;
  gpu: GpuProduct;
}

export const GpuAutocompleteOption: FunctionComponent<
  GpuAutocompleteOptionProps
> = (props) => {
  const { index, gpu } = props;

  const id = gpu.id;
  const name = useMemo(() => formatProductName(gpu, { company: false }), [gpu]);
  const shortName = useMemo(
    () => formatProductName(gpu, { company: false }),
    [gpu],
  );
  const image = useMemo(() => getCompanyLogoAutocompletePath(gpu), [gpu]);
  const company = useMemo(() => formatCompanyName(gpu.company), [gpu]);

  const companyAndMarketSegment = useMemo(() => {
    const marketSegment = productFieldFormattedValue(gpu.fields.marketSegment);
    return [company, marketSegment].filter((value) => value != null).join(', ');
  }, [company, gpu.fields.marketSegment]);
  const releaseDate = useMemo(
    () => productFieldFormattedValue(gpu.fields.releaseDate),
    [gpu.fields.releaseDate],
  );
  const price = useMemo(
    () => productFieldFormattedValue(gpu.fields.msrp),
    [gpu.fields.msrp],
  );

  return (
    <AutocompleteOption index={index} label={shortName} value={`${id}`}>
      <div className="flex flex-1 items-center gap-4">
        <div className="w-8 xs:hidden">
          {image != null ? (
            <Img loading="lazy" src={image} alt={company} />
          ) : (
            <></>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1 items-start">
          <span className="flex-1 text-base font-medium">{name}</span>
          <span className="flex-1 text-sm text-dimmed">
            {companyAndMarketSegment}
          </span>
        </div>

        <div className="flex flex-col gap-1 items-end text-sm 2xs:hidden">
          <div className="text-dimmed">{releaseDate}</div>
          <div className="text-dimmed">{price}</div>
        </div>
      </div>
    </AutocompleteOption>
  );
};
