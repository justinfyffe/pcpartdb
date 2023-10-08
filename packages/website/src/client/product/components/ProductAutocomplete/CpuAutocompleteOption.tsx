import {
  CpuProduct,
  formatCompanyName,
  formatProductName,
  productFieldFormattedValue,
} from '@pcpartdb/shared';
import React, { FunctionComponent, useMemo } from 'react';
import { getCompanyLogoAutocompletePath } from '../../../image/utils';
import { AutocompleteOption } from '../../../shared/components/Autocomplete/AutocompleteOption';
import { Img } from '../../../shared/components/Img/Img';

interface CpuAutocompleteOptionProps {
  index: number;
  cpu: CpuProduct;
}

export const CpuAutocompleteOption: FunctionComponent<
  CpuAutocompleteOptionProps
> = (props) => {
  const { index, cpu } = props;

  const id = cpu.id;
  const name = useMemo(() => formatProductName(cpu, { company: false }), [cpu]);
  const shortName = useMemo(
    () => formatProductName(cpu, { company: false }),
    [cpu],
  );
  const image = useMemo(() => getCompanyLogoAutocompletePath(cpu), [cpu]);
  const company = useMemo(() => formatCompanyName(cpu.company), [cpu]);

  const companyAndMarketSegment = useMemo(() => {
    const marketSegment = productFieldFormattedValue(cpu.fields.marketSegment);
    return [company, marketSegment].filter((value) => value != null).join(', ');
  }, [company, cpu.fields.marketSegment]);
  const releaseDate = useMemo(
    () => productFieldFormattedValue(cpu.fields.releaseDate),
    [cpu.fields.releaseDate],
  );
  const price = useMemo(
    () => productFieldFormattedValue(cpu.fields.msrp),
    [cpu.fields.msrp],
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
