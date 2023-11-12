import {
  BenchmarkKey,
  getProductBenchmarkLabel,
  ProductBenchmark,
} from '@pcpartdb/shared';
import { Checkbox } from 'packages/website/src/client/shared/components/Checkbox/Checkbox';
import {
  Td,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ScrapeProductContext } from './ScrapeProductContext';

interface ScrapedBenchmarkRowProps {
  benchmarkKey?: BenchmarkKey;
}

export const ScrapedBenchmarkRow: FunctionComponent<
  ScrapedBenchmarkRowProps
> = (props) => {
  const { benchmarkKey } = props;

  const context = useContext(ScrapeProductContext);
  const benchmarks = context.data.benchmarks;

  const emptyValue = useMemo(() => getEmptyValue(benchmarkKey), [benchmarkKey]);
  const label = getProductBenchmarkLabel(benchmarkKey);

  const rawValue = useMemo(() => {
    const benchmark = benchmarks?.[benchmarkKey]?.value as ProductBenchmark;
    return `${benchmark?.value ?? '--'}`;
  }, [benchmarks, benchmarkKey]);

  const formattedValue = useMemo(() => {
    const benchmark = benchmarks?.[benchmarkKey]?.value as ProductBenchmark;
    return `${benchmark?.value?.toLocaleString() ?? '--'}`;
  }, [benchmarks, benchmarkKey]);

  const [checked, setChecked] = useState(() => false);

  useEffect(() => {
    if (benchmarks[benchmarkKey] == null) {
      benchmarks[benchmarkKey] = { value: emptyValue, enabled: false };
      setChecked(false);
    } else {
      setChecked(benchmarks[benchmarkKey].enabled);
    }
  }, [benchmarks, benchmarkKey, emptyValue]);

  const handleClick = useCallback(() => {
    const benchmarkData = benchmarks[benchmarkKey];
    benchmarkData.enabled = !checked;

    setChecked(!checked);
  }, [checked, benchmarks, benchmarkKey]);

  return (
    <Tr onClick={handleClick} className="hover:bg-mouse-hover cursor-pointer">
      <Td>{label}</Td>
      <Td>{rawValue}</Td>
      <Td>{formattedValue}</Td>
      <Td className="text-right">
        <Checkbox value={benchmarks?.[benchmarkKey]?.enabled ?? false} />
      </Td>
    </Tr>
  );
};

function getEmptyValue(benchmarkKey: BenchmarkKey): ProductBenchmark {
  return { benchmarkKey };
}
