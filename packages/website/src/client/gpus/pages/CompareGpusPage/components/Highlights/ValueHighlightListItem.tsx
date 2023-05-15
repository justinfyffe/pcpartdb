import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { getChipset } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { formatGpuField, getGpuName } from '../../../..';
import { ComparePageContext } from '../../context';
import {
  HighlightLabel,
  HighlightListItem,
  HighlightValue,
  HighlightValues,
} from './HighlightList';

interface ValueHighlightListItemProps {
  className?: string;
}

export const ValueHighlightListItem: FunctionComponent<
  ValueHighlightListItemProps
> = (props) => {
  const { className } = props;

  const context = useContext(ComparePageContext);
  const [gpu1, gpu2] = context.comparison;
  const chipset1 = getChipset(gpu1);
  const chipset2 = getChipset(gpu2);

  const names = useMemo(
    () => [
      getGpuName(gpu1, { company: false, brand: false }),
      getGpuName(gpu2, { company: false, brand: false }),
    ],
    [gpu1, gpu2],
  );

  const values = useMemo(() => {
    return [
      formatGpuField(chipset1.valueScore) || '--',
      formatGpuField(chipset2.valueScore) || '--',
    ];
  }, [chipset1, chipset2]);

  const [bold1, bold2] = useMemo(() => {
    return [
      chipset1.valueScore?.value > chipset2.valueScore?.value,
      chipset1.valueScore?.value < chipset2.valueScore?.value,
    ];
  }, [chipset1.valueScore?.value, chipset2.valueScore?.value]);

  return (
    <HighlightListItem className={className}>
      <HighlightLabel icon={<CurrencyDollarIcon />}>
        Performance / $
      </HighlightLabel>

      <HighlightValues>
        <HighlightValue
          name={names[0]}
          value={values[0]}
          className={bold1 ? 'font-bold' : ''}
        />
        <HighlightValue
          name={names[1]}
          value={values[1]}
          className={bold2 ? 'font-bold' : ''}
        />
      </HighlightValues>
    </HighlightListItem>
  );
};
