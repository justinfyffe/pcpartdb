import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import {
  DateFormat,
  formatDate,
  formatProductName,
  GpuProductComparison,
  productFieldFormattedValue,
  productFieldRawValue,
} from '@pcpartdb/shared';
import { ProductHighlightComparison } from 'packages/website/src/app/_common/product/components/ProductHighlightComparison/ProductHighlightComparison';
import React, { FunctionComponent } from 'react';

interface ReleaseDateHighlightListItemProps {
  comparison: GpuProductComparison;
  className?: string;
}

export const ReleaseDateHighlightListItem: FunctionComponent<
  ReleaseDateHighlightListItemProps
> = (props) => {
  const { comparison, className } = props;
  const [gpu1, gpu2] = comparison;

  const name1 = formatProductName(gpu1, { company: false, brand: true });
  const name2 = formatProductName(gpu2, { company: false, brand: true });

  const value1 = productFieldFormattedValue(gpu1.fields?.releaseDate) ?? '--';
  const value2 = productFieldFormattedValue(gpu2.fields?.releaseDate) ?? '--';

  const releaseDate1 = gpu1.fields?.releaseDate
    ? formatDate(productFieldRawValue(gpu1.fields?.releaseDate), {
        format: DateFormat.YearQuarter,
      })
    : 0;
  const releaseDate2 = gpu2.fields?.releaseDate
    ? formatDate(productFieldRawValue(gpu2.fields?.releaseDate), {
        format: DateFormat.YearQuarter,
      })
    : 0;

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
