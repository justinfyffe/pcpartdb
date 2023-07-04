import { Cpu, DateFormat } from '@pcpartdb/shared';
import React, { FunctionComponent, useMemo } from 'react';
import { getCompanyLogoAutocompletePath } from '../../../image';
import { AutocompleteOption, Img } from '../../../shared/components';
import { formatCpuField, formatCpuName } from '../../utils/cpuUtils';

interface CpuAutocompleteOptionProps {
  index: number;
  cpu: Cpu;
}

export const CpuAutocompleteOption: FunctionComponent<
  CpuAutocompleteOptionProps
> = (props) => {
  const { index, cpu } = props;

  const id = cpu.id;
  const name = useMemo(() => formatCpuName(cpu, { company: false }), [cpu]);
  const shortName = useMemo(
    () => formatCpuName(cpu, { company: false }),
    [cpu],
  );
  const image = useMemo(() => getCompanyLogoAutocompletePath(cpu), [cpu]);
  const company = useMemo(() => formatCpuField(cpu.company), [cpu]);

  const companyAndMarketSegments = useMemo(() => {
    const marketSegments = formatCpuField(cpu.marketSegments);
    return [company, marketSegments]
      .filter((value) => value != null)
      .join(', ');
  }, [company, cpu.marketSegments]);
  const releaseDate = useMemo(
    () =>
      formatCpuField(cpu.releaseDate, {
        dateFormat: DateFormat.QuarterYear,
      }),
    [cpu.releaseDate],
  );
  const price = useMemo(
    () => formatCpuField(cpu.launchPrice),
    [cpu.launchPrice],
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
            {companyAndMarketSegments}
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
