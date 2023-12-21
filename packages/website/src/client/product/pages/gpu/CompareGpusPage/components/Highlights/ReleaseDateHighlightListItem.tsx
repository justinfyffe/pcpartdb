import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import {
  formatProductName,
  productFieldFormattedValue,
} from '@pcpartdb/shared';
import { ProductHighlightComparison } from 'packages/website/src/client/product/components/ProductHighlightComparison/ProductHighlightComparison';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context/ComparePageContextProvider';

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
    const name1 = formatProductName(gpu1, { company: false, brand: true });
    const name2 = formatProductName(gpu2, { company: false, brand: true });

    const value1 = productFieldFormattedValue(gpu1.fields?.releaseDate) ?? '--';
    const value2 = productFieldFormattedValue(gpu2.fields?.releaseDate) ?? '--';

    const releaseDate1 = productFieldFormattedValue(gpu1.fields?.releaseDate);
    const releaseDate2 = productFieldFormattedValue(gpu2.fields?.releaseDate);
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
