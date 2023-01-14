import { Checkbox, Td, Tr } from '@client/shared/components';
import { Benchmark, BenchmarkKey, formatBenchmark } from '@shared/benchmark';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ImportPartDataContext } from './import-part-data-context';

const LABELS: Record<string, string> = {
  g3dMark: 'G3D Mark',
  g2dMark: 'G2D Mark',
  timeSpyPhysics: '3DMark Time Spy Graphics',
};

interface ImportBenchmarkProps {
  benchmark: BenchmarkKey;
}

export const ImportBenchmark: FunctionComponent<ImportBenchmarkProps> = (
  props,
) => {
  const { benchmark: key } = props;

  const context = useContext(ImportPartDataContext);
  const benchmarks = context.benchmarks;
  const emptyValue: Benchmark = useMemo(
    () => ({ value: null, metadata: { benchmarkKey: key } }),
    [key],
  );

  const [checked, setChecked] = useState(() => false);

  useEffect(() => {
    if (benchmarks[key] == null) {
      benchmarks[key] = { value: emptyValue, import: false };
      setChecked(false);
    } else {
      setChecked(benchmarks[key].import);
    }
  }, [benchmarks, key, emptyValue]);

  const handleClick = useCallback(() => {
    if (checked) {
      benchmarks[key].import = true;
    } else {
      benchmarks[key].import = false;
    }

    setChecked(!checked);
  }, [benchmarks, key, checked]);

  return (
    <Tr onClick={handleClick} className="hover:bg-gray-200 cursor-pointer">
      <Td>{LABELS[key]}</Td>
      <Td>{formatBenchmark(benchmarks?.[key]?.value) || '--'}</Td>
      <Td className="text-right">
        <Checkbox value={benchmarks?.[key]?.import ?? false} />
      </Td>
    </Tr>
  );
};
