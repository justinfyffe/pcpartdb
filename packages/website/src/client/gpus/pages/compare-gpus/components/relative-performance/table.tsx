import { getGpuName, getViewGpuSlug } from '@pcpartdb/website/client/gpus';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '@pcpartdb/website/client/shared/components';
import { getViewGpuPath } from '@pcpartdb/website/client/shared/website';
import { Gpu } from '@pcpartdb/website/shared/gpus';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ComparePageContext } from '../../context';
import { CustomRow, CustomRowLabel, CustomRowValue } from '../custom-row';

interface PerformanceTableProps {
  className?: string;
}

export const PerformanceTable: FunctionComponent<PerformanceTableProps> = (
  props,
) => {
  const { className } = props;
  const { comparison, contentData } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;
  const { relativePerformanceGpus } = contentData;

  const [baselineGpu, setBaselineGpu] = useState(() => {
    if (
      gpu1.benchmarks?.performanceScore?.value == null &&
      gpu2.benchmarks?.performanceScore?.value == null
    ) {
      return null;
    } else {
      return gpu1.benchmarks?.performanceScore?.value != null ? gpu1 : gpu2;
    }
  });
  const [secondaryGpu, setSecondaryGpu] = useState(() => {
    if (
      gpu1.benchmarks?.performanceScore?.value == null ||
      gpu2.benchmarks?.performanceScore?.value == null
    ) {
      return null;
    } else {
      return gpu2;
    }
  });

  // Add nulls to rank gaps
  const gpus = useMemo(() => {
    const ret: Gpu[] = [];
    for (let i = 0; i < relativePerformanceGpus.length; ++i) {
      if (i > 0) {
        const rankDiff =
          relativePerformanceGpus[i].ranks.performanceRank -
          relativePerformanceGpus[i - 1].ranks.performanceRank;
        if (rankDiff !== 1) {
          ret.push(null);
        }
      }
      ret.push(relativePerformanceGpus[i]);
    }
    return ret;
  }, [relativePerformanceGpus]);

  useEffect(() => {
    if (
      gpu1.benchmarks?.performanceScore?.value == null &&
      gpu2.benchmarks?.performanceScore?.value == null
    ) {
      setBaselineGpu(null);
    } else {
      setBaselineGpu(
        gpu1.benchmarks?.performanceScore?.value != null ? gpu1 : gpu2,
      );
    }

    if (
      gpu1.benchmarks?.performanceScore?.value == null ||
      gpu2.benchmarks?.performanceScore?.value == null
    ) {
      setSecondaryGpu(null);
    } else {
      setSecondaryGpu(gpu2);
    }
  }, [gpu1, gpu2]);

  const getRelativePerformance = useCallback(
    (relatedGpu: Gpu) => {
      const baseline = baselineGpu.benchmarks.performanceScore.value;
      const relatedPerf = relatedGpu.benchmarks.performanceScore.value;

      return ((relatedPerf / baseline) * 100).toFixed(0);
    },
    [baselineGpu],
  );

  const toggleBaselineGpu = useCallback(
    (gpu: Gpu) => {
      setSecondaryGpu(baselineGpu);
      setBaselineGpu(gpu);
    },
    [baselineGpu],
  );

  return (
    <>
      <div className="mb-1 text-right">
        Baseline:{' '}
        <BaselineToggle
          gpu={gpu1}
          active={baselineGpu?.id === gpu1.id}
          onClick={() => toggleBaselineGpu(gpu1)}
        />{' '}
        or{' '}
        <BaselineToggle
          gpu={gpu2}
          active={baselineGpu?.id === gpu2.id}
          onClick={() => toggleBaselineGpu(gpu2)}
        />
      </div>
      <Table border responsive className={className}>
        <THead>
          <Tr>
            <Th></Th>
            <Th className="text-left">Relative Performance</Th>
            <Th className="text-left">Rank</Th>
          </Tr>
        </THead>
        <TBody>
          {gpus.map((gpu) =>
            gpu != null ? (
              <CustomRow
                key={gpu.id}
                highlight={gpu.id === baselineGpu?.id}
                secondary={gpu.id === secondaryGpu?.id}
              >
                <CustomRowLabel>
                  <a href={getViewGpuPath(getViewGpuSlug(gpu))}>
                    {getGpuName(gpu, { company: false })}
                  </a>
                </CustomRowLabel>
                <CustomRowValue className="text-left">
                  {getRelativePerformance(gpu)}%
                </CustomRowValue>
                <CustomRowValue className="text-left">
                  {gpu.ranks?.performanceRank}
                </CustomRowValue>
              </CustomRow>
            ) : (
              <Tr>
                <Td colSpan={3} className="text-center">
                  &#8230;
                </Td>
              </Tr>
            ),
          )}
        </TBody>
      </Table>
    </>
  );
};

interface BaselineToggleProps {
  gpu: Gpu;
  active: boolean;
  onClick: () => void;
}

export const BaselineToggle: FunctionComponent<BaselineToggleProps> = (
  props,
) => {
  const { gpu, active, onClick } = props;

  if (gpu.benchmarks?.performanceScore?.value == null) {
    return (
      <span className="text-content-dimmed cursor-not-allowed">
        {getGpuName(gpu)}
      </span>
    );
  }

  if (active) {
    return <span className="font-bold">{getGpuName(gpu)}</span>;
  } else {
    return (
      <a className="cursor-pointer" onClick={onClick}>
        {getGpuName(gpu)}
      </a>
    );
  }
};
