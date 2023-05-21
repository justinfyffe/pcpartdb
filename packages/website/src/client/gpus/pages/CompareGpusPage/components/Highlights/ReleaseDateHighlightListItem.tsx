import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { DateFormat } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { formatGpuField, getGpuName } from '../../../..';
import { ComparePageContext } from '../../context';
import {
  HighlightLabel,
  HighlightListItem,
  HighlightValue,
  HighlightValues,
} from './HighlightList';

interface ReleaseDateHighlightListItemProps {
  className?: string;
}

export const ReleaseDateHighlightListItem: FunctionComponent<
  ReleaseDateHighlightListItemProps
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
      formatGpuField(gpu1.releaseDate) || '--',
      formatGpuField(gpu2.releaseDate) || '--',
    ];
  }, [gpu1.releaseDate, gpu2.releaseDate]);

  const [bold1, bold2] = useMemo(() => {
    const releaseDate1 = formatGpuField(gpu1.releaseDate, {
      dateFormat: DateFormat.YearQuarter,
    });
    const releaseDate2 = formatGpuField(gpu2.releaseDate, {
      dateFormat: DateFormat.YearQuarter,
    });
    return [releaseDate1 > releaseDate2, releaseDate1 < releaseDate2];
  }, [gpu1.releaseDate, gpu2.releaseDate]);

  return (
    <HighlightListItem className={className}>
      <HighlightLabel icon={<CalendarDaysIcon />}>Release Date</HighlightLabel>

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
