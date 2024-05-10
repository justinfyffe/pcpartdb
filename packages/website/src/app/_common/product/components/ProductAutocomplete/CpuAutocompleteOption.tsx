'use client';

import {
  CpuProduct,
  formatCompanyName,
  formatProductName,
  productFieldFormattedValue,
} from '@pcpartdb/shared';
import React, { useMemo } from 'react';
import { AutocompleteOption } from '../../../components/Autocomplete/AutocompleteOption';
import { Img } from '../../../components/Img/Img';
import { companyLogoAutocompletePath } from '../../../utils/companyLogoAutocompletePath';

interface CpuAutocompleteOptionProps {
  index: number;
  cpu: CpuProduct;
}

export function CpuAutocompleteOption(props: CpuAutocompleteOptionProps) {
  const { index, cpu } = props;

  const id = cpu.id;
  const name = useMemo(() => formatProductName(cpu, { company: false }), [cpu]);
  const shortName = useMemo(
    () => formatProductName(cpu, { company: false }),
    [cpu],
  );
  const image = useMemo(() => companyLogoAutocompletePath(cpu), [cpu]);
  const company = useMemo(() => formatCompanyName(cpu.company), [cpu]);

  const companyAndMarketSegment = useMemo(() => {
    const marketSegment = productFieldFormattedValue(cpu.fields?.marketSegment);
    return [company, marketSegment].filter((value) => value != null).join(', ');
  }, [company, cpu.fields?.marketSegment]);
  const releaseDate = useMemo(
    () => productFieldFormattedValue(cpu.fields?.releaseDate),
    [cpu.fields?.releaseDate],
  );
  const price = useMemo(
    () => productFieldFormattedValue(cpu.fields?.msrp),
    [cpu.fields?.msrp],
  );

  return (
    <AutocompleteOption index={index} label={shortName!} value={`${id}`}>
      <div className="flex flex-1 items-center gap-4">
        <div className="w-8 xs:hidden">
          {image != null ? (
            <Img loading="lazy" src={image} alt={company || undefined} />
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
