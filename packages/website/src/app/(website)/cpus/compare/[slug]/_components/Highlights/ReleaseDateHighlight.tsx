import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import {
  CpuProductComparison,
  DateFormat,
  formatDate,
  formatProductName,
  productFieldFormattedValue,
  productFieldRawValue,
} from '@pcpartdb/shared';
import { ProductHighlightComparison } from 'packages/website/src/app/_common/product/components/ProductHighlightComparison/ProductHighlightComparison';
import React, { FunctionComponent } from 'react';

interface ReleaseDateHighlightProps {
  comparison: CpuProductComparison;
  className?: string;
}

export const ReleaseDateHighlight: FunctionComponent<
  ReleaseDateHighlightProps
> = (props) => {
  const { comparison, className } = props;
  const [cpu1, cpu2] = comparison;

  const name1 = formatProductName(cpu1, { company: false, brand: true });
  const name2 = formatProductName(cpu2, { company: false, brand: true });

  const value1 = productFieldFormattedValue(cpu1.fields?.releaseDate) ?? '--';
  const value2 = productFieldFormattedValue(cpu2.fields?.releaseDate) ?? '--';

  const releaseDate1 = formatDate(
    productFieldRawValue(cpu1.fields?.releaseDate),
    { format: DateFormat.YearQuarter },
  );
  const releaseDate2 = formatDate(
    productFieldRawValue(cpu2.fields?.releaseDate),
    { format: DateFormat.YearQuarter },
  );

  const bold1 = releaseDate1 > releaseDate2;
  const bold2 = releaseDate1 < releaseDate2;

  const values = [
    { name: name1, value: value1, bold: bold1 },
    { name: name2, value: value2, bold: bold2 },
  ];

  return (
    <ProductHighlightComparison
      icon={<CalendarDaysIcon />}
      label="Release Date"
      values={values}
      className={className}
    ></ProductHighlightComparison>
  );
};
