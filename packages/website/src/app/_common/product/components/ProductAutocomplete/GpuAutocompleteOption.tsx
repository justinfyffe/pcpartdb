'use client';

import {
  formatCompanyName,
  formatProductName,
  GpuProduct,
  productFieldFormattedValue,
} from '@pcpartdb/shared';
import React, { useMemo } from 'react';
import { AutocompleteOption } from '../../../components/Autocomplete/AutocompleteOption';
import { Img } from '../../../components/Img/Img';
import { companyLogoAutocompletePath } from '../../../utils/companyLogoAutocompletePath';

interface GpuAutocompleteOptionProps {
  index: number;
  gpu: GpuProduct;
}

export function GpuAutocompleteOption(props: GpuAutocompleteOptionProps) {
  const { index, gpu } = props;

  const id = gpu.id;
  const name = useMemo(() => formatProductName(gpu, { company: false }), [gpu]);
  const shortName = useMemo(
    () => formatProductName(gpu, { company: false }),
    [gpu],
  );
  const image = useMemo(() => companyLogoAutocompletePath(gpu), [gpu]);
  const company = useMemo(() => formatCompanyName(gpu.company), [gpu]);

  const companyAndMarketSegment = useMemo(() => {
    const marketSegment = productFieldFormattedValue(gpu.fields?.marketSegment);
    return [company, marketSegment].filter((value) => value != null).join(', ');
  }, [company, gpu.fields?.marketSegment]);
  const releaseDate = useMemo(
    () => productFieldFormattedValue(gpu.fields?.releaseDate),
    [gpu.fields?.releaseDate],
  );
  const price = useMemo(
    () => productFieldFormattedValue(gpu.fields?.msrp),
    [gpu.fields?.msrp],
  );

  return (
    <AutocompleteOption index={index} label={shortName!} value={`${id}`}>
      <div className="flex flex-1 items-center gap-4">
        <div className="w-8 xs:hidden">
          {image != null ? (
            <Img src={image} alt={company || undefined} />
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
}
