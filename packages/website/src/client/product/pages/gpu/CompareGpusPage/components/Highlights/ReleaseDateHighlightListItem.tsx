import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { DateFormat, formatGpuField, formatGpuName } from '@pcpartdb/shared';
import { ProductHighlightComparison } from 'packages/website/src/client/product/components/ProductHighlightComparison/ProductHighlightComparison';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context';

interface ReleaseDateHighlightListItemProps {
  className?: string;
}

export const ReleaseDateHighlightListItem: FunctionComponent<
  ReleaseDateHighlightListItemProps
> = (props) => {
  const { className } = props;

  const context = useContext(ComparePageContext);
  const [gpu1, gpu2] = context.comparison;

  const values = useMemo(() => {
    const name1 = formatGpuName(gpu1, { company: false, brand: true });
    const name2 = formatGpuName(gpu2, { company: false, brand: true });

    const value1 = formatGpuField(gpu1.releaseDate) || '--';
    const value2 = formatGpuField(gpu2.releaseDate) || '--';

    const releaseDate1 = formatGpuField(gpu1.releaseDate, {
      dateFormat: DateFormat.YearQuarter,
    });
    const releaseDate2 = formatGpuField(gpu2.releaseDate, {
      dateFormat: DateFormat.YearQuarter,
    });
    const bold1 = releaseDate1 > releaseDate2;
    const bold2 = releaseDate1 < releaseDate2;

    return [
      { name: name1, value: value1, bold: bold1 },
      { name: name2, value: value2, bold: bold2 },
    ];
  }, [gpu1, gpu2]);

  return (
    <ProductHighlightComparison
      icon={<CalendarDaysIcon />}
      label="Release Date"
      values={values}
      className={className}
    ></ProductHighlightComparison>
  );
};
