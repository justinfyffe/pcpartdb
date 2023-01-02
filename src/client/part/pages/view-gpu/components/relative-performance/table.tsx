import { getGpuName, getViewGpuSlug } from '@client/part';
import { Table, TBody, Th, THead, Tr } from '@client/shared/components';
import { getViewGpuPath } from '@client/shared/website';
import { Part } from '@shared/part';
import { formatPartMeta } from '@shared/part-meta';
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
  const { part, contentData } = useContext(ViewPageContext);
  const { relativePerformanceGpus } = contentData;

  const getRelativePerformance = useCallback(
    (relatedGpu: Part) => {
      const baseline = part.benchmarks.performanceScore.value;
      const relatedPerformance = relatedGpu.benchmarks.performanceScore.value;

      return ((relatedPerformance / baseline) * 100).toFixed(0);
    },
    [part],
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
        {relativePerformanceGpus.map((gpu) => (
          <CustomRow key={gpu.id} highlight={gpu.id === part.id}>
            <CustomRowLabel>
              <a href={getViewGpuPath(getViewGpuSlug(gpu))}>
                {getGpuName(gpu, { company: false })}
              </a>
            </CustomRowLabel>
            <CustomRowValue className="text-left">
              {getRelativePerformance(gpu)}%
            </CustomRowValue>
            <CustomRowValue className="text-left">
              {formatPartMeta(gpu.metas?.performanceRank)}
            </CustomRowValue>
          </CustomRow>
        ))}
      </TBody>
    </Table>
  );
};
