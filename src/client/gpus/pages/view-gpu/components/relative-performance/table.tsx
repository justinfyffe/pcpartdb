import { getGpuName, getViewGpuSlug } from '@client/gpus';
import { Table, TBody, Th, THead, Tr } from '@client/shared/components';
import { getViewGpuPath } from '@client/shared/website';
import { Gpu } from '@shared/gpus';
import React, { FunctionComponent, useCallback, useContext } from 'react';
import { ViewPageContext } from '../../context';
import { CustomRow, CustomRowLabel, CustomRowValue } from '../custom-row';

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
          <CustomRow key={relativeGpu.id} highlight={relativeGpu.id === gpu.id}>
            <CustomRowLabel>
              <a href={getViewGpuPath(getViewGpuSlug(relativeGpu))}>
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
        ))}
      </TBody>
    </Table>
  );
};
