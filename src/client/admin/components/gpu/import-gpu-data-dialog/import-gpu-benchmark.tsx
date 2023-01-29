import { formatGpuBenchmark } from '@client/gpus';
import { Checkbox, Td, Tr } from '@client/shared/components';
import { GpuBenchmark, GpuBenchmarkKey } from '@shared/gpus';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ImportGpuDataContext } from './import-gpu-data-context';

const LABELS: Record<string, string> = {
  g3dMark: 'G3D Mark',
  g2dMark: 'G2D Mark',
  timespyGraphics: '3DMark Time Spy Graphics',
};

interface ImportGpuBenchmarkProps {
  benchmark: GpuBenchmarkKey;
}

export const ImportGpuBenchmark: FunctionComponent<ImportGpuBenchmarkProps> = (
  props,
) => {
  const { benchmark: key } = props;

  const context = useContext(ImportGpuDataContext);
  const benchmarks = context.benchmarks;
  const emptyValue: GpuBenchmark = useMemo(
    () => ({ value: null, meta: { benchmarkKey: key } }),
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
      <Td>{formatGpuBenchmark(benchmarks?.[key]?.value) || '--'}</Td>
      <Td className="text-right">
        <Checkbox value={benchmarks?.[key]?.import ?? false} />
      </Td>
    </Tr>
  );
};
