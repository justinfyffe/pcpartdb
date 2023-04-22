import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
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

  const names = useMemo(
    () => [
      getGpuName(gpu1, { company: false, brand: false }),
      getGpuName(gpu2, { company: false, brand: false }),
    ],
    [gpu1, gpu2],
  );

  const values = useMemo(() => {
    return [
      formatGpuField(gpu1.valueScore) || '--',
      formatGpuField(gpu2.valueScore) || '--',
    ];
  }, [gpu1, gpu2]);

  const [bold1, bold2] = useMemo(() => {
    return [
      gpu1.valueScore?.value > gpu2.valueScore?.value,
      gpu1.valueScore?.value < gpu2.valueScore?.value,
    ];
  }, [gpu1.valueScore?.value, gpu2.valueScore?.value]);

  return (
    <HighlightListItem className={className}>
      <HighlightLabel icon={<CurrencyDollarIcon className="md:hidden" />}>
        Performance Per Dollar
      </HighlightLabel>

      <HighlightValues>
        <HighlightValue className={bold1 ? 'font-bold' : ''}>
          {names[0]}: {values[0]}
        </HighlightValue>
        <HighlightValue className={bold2 ? 'font-bold' : ''}>
          {names[1]}: {values[1]}
        </HighlightValue>
      </HighlightValues>
    </HighlightListItem>
  );
};
