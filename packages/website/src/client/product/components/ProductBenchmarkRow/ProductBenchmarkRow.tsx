import { getProductBenchmarkLabel, ProductBenchmark } from '@pcpartdb/shared';
import {
  Td,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent, useMemo } from 'react';
import { classNames } from '../../../shared/ui/classNames';

interface ProductBenchmarkRowProps {
  benchmarks: ProductBenchmark[];

  indent?: boolean;
  className?: string;
}

export const ProductBenchmarkRow: FunctionComponent<
  ProductBenchmarkRowProps
> = (props) => {
  const { benchmarks, indent, className } = props;
  const [benchmark1, benchmark2] = benchmarks;

  const label = useMemo(() => {
    const benchmarkKey = benchmark1?.benchmarkKey || benchmark2?.benchmarkKey;

    return getProductBenchmarkLabel(benchmarkKey);
  }, [benchmark1?.benchmarkKey, benchmark2?.benchmarkKey]);

  const benchmarkValues = useMemo(() => {
    return benchmarks.map((benchmark) => benchmark?.value);
  }, [benchmarks]);

  const hasValues = useMemo(
    () => benchmarkValues.some((value) => value != null),
    [benchmarkValues],
  );

  if (!hasValues) {
    return <></>;
  }

  return (
    <Tr className={className}>
      <Td
        className={classNames(
          'text-left',
          benchmarks.length === 1 ? 'w-[50%]' : '',
          benchmarks.length === 2 ? 'w-[33%]' : '',
          indent ? 'pl-6' : '',
        )}
      >
        {label}
      </Td>
      {benchmarkValues.map((value, i) => (
        <Td
          key={i}
          className={classNames(
            'text-left',
            benchmarks.length === 1 ? 'w-[50%]' : '',
            benchmarks.length === 2 ? 'w-[33%]' : '',
          )}
        >
          {value?.toLocaleString() ?? '--'}
        </Td>
      ))}
    </Tr>
  );
};
