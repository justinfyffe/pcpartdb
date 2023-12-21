import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import {
  formatProductName,
  productFieldFormattedValue,
} from '@pcpartdb/shared';
import { ProductHighlightComparison } from 'packages/website/src/client/product/components/ProductHighlightComparison/ProductHighlightComparison';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context/ComparePageContextProvider';

interface ReleaseDateHighlightProps {
  className?: string;
}

export const ReleaseDateHighlight: FunctionComponent<
  ReleaseDateHighlightProps
> = (props) => {
  const { className } = props;

  const context = useContext(ComparePageContext);
  const [cpu1, cpu2] = context.comparison;

  const values = useMemo(() => {
    const name1 = formatProductName(cpu1, { company: false, brand: true });
    const name2 = formatProductName(cpu2, { company: false, brand: true });

    const value1 = productFieldFormattedValue(cpu1.fields?.releaseDate) ?? '--';
    const value2 = productFieldFormattedValue(cpu2.fields?.releaseDate) ?? '--';

    const releaseDate1 = productFieldFormattedValue(cpu1.fields?.releaseDate);
    const releaseDate2 = productFieldFormattedValue(cpu2.fields?.releaseDate);
    const bold1 = releaseDate1 > releaseDate2;
    const bold2 = releaseDate1 < releaseDate2;

    return [
      { name: name1, value: value1, bold: bold1 },
      { name: name2, value: value2, bold: bold2 },
    ];
  }, [cpu1, cpu2]);

  return (
    <ProductHighlightComparison
      icon={<CalendarDaysIcon />}
      label="Release Date"
      values={values}
      className={className}
    ></ProductHighlightComparison>
  );
};
