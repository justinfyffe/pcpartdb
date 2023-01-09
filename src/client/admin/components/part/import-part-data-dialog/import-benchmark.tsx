import { Checkbox, Td, Tr } from '@client/shared/components';
import { BenchmarkKey, formatBenchmark } from '@shared/benchmark';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
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

  const [benchmark] = useState(() => {
    if (benchmarks?.[key] == null || benchmarks?.[key]?.value == null) {
      delete benchmarks?.[key];
      return null;
    }
    return benchmarks[key];
  });
  const [checked, setChecked] = useState(() => benchmark != null);

  const handleClick = useCallback(() => {
    if (checked) {
      delete benchmarks[key];
    } else {
      benchmarks[key] = benchmark;
    }

    setChecked(!checked);
  }, [benchmarks, key, benchmark, checked]);

  return (
    <Tr onClick={handleClick} className="hover:bg-gray-200 cursor-pointer">
      <Td>{LABELS[key]}</Td>
      <Td>{formatBenchmark(benchmark) || '--'}</Td>
      <Td className="text-right">
        <Checkbox value={checked} />
      </Td>
    </Tr>
  );
};
