import { getViewGpuPath, Gpu } from '@pcpartdb/shared';
import React, { FunctionComponent, useCallback, useContext } from 'react';
import { Table, TBody, Th, THead, Tr } from '../../../../../shared/components';
import { getGpuName } from '../../../..';
import { ViewPageContext } from '../../context';
import { CustomRow, CustomRowLabel, CustomRowValue } from '../CustomRow';

interface PerformanceTableProps {
  className?: string;
}

export const PerformanceTable: FunctionComponent<PerformanceTableProps> = (
  props,
) => {
  const { className } = props;
  const { gpu, contentData } = useContext(ViewPageContext);
  const { relativePerformanceGpus } = contentData;

  const getRelativePerformance = useCallback(
    (relatedGpu: Gpu) => {
      const baseline = gpu.benchmarks.performanceScore.value;
      const relatedPerformance = relatedGpu.benchmarks.performanceScore.value;

      return ((relatedPerformance / baseline) * 100).toFixed(0);
    },
    [gpu],
  );

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th></Th>
          <Th className="text-left">Relative Performance</Th>
          <Th className="text-left">Rank</Th>
        </Tr>
      </THead>
      <TBody>
        {relativePerformanceGpus.map((relativeGpu) => (
          <PerformanceTableRow
            key={relativeGpu.id}
            baselineGpu={gpu}
            relativeGpu={relativeGpu}
          />
        ))}
      </TBody>
    </Table>
  );
};

interface PerformanceTableRowProps {
  baselineGpu: Gpu;
  relativeGpu: Gpu;
}

export const PerformanceTableRow: FunctionComponent<
  PerformanceTableRowProps
> = (props) => {
  const { baselineGpu, relativeGpu } = props;

  const getRelativePerformance = useCallback(
    (relatedGpu: Gpu) => {
      const baseline = baselineGpu.benchmarks.performanceScore.value;
      const relatedPerformance = relatedGpu.benchmarks.performanceScore.value;

      return ((relatedPerformance / baseline) * 100).toFixed(0);
    },
    [baselineGpu],
  );

  return (
    <CustomRow highlight={relativeGpu.id === baselineGpu.id}>
      <CustomRowLabel>
        <a href={getViewGpuPath(relativeGpu)}>
          {getGpuName(relativeGpu, { company: false })}
        </a>
      </CustomRowLabel>
      <CustomRowValue className="text-left">
        {getRelativePerformance(relativeGpu)}%
      </CustomRowValue>
      <CustomRowValue className="text-left">
        {relativeGpu.ranks?.performanceRank}
      </CustomRowValue>
    </CustomRow>
  );
};
