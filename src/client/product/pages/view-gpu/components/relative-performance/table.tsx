import { getGpuName, getViewGpuSlug } from '@client/product';
import { Table, TBody, Th, THead, Tr } from '@client/shared/components';
import { getViewGpuPath } from '@client/shared/website';
import { Product } from '@shared/product';
import { formatProductMeta } from '@shared/product-meta';
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
  const { product, contentData } = useContext(ViewPageContext);
  const { relativePerformanceGpus } = contentData;

  const getRelativePerformance = useCallback(
    (relatedGpu: Product) => {
      const baseline = product.benchmarks.performanceScore.value;
      const relatedPerformance = relatedGpu.benchmarks.performanceScore.value;

      return ((relatedPerformance / baseline) * 100).toFixed(0);
    },
    [product],
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
          <CustomRow key={gpu.id} highlight={gpu.id === product.id}>
            <CustomRowLabel>
              <a href={getViewGpuPath(getViewGpuSlug(gpu))}>
                {getGpuName(gpu, { company: false })}
              </a>
            </CustomRowLabel>
            <CustomRowValue className="text-left">
              {getRelativePerformance(gpu)}%
            </CustomRowValue>
            <CustomRowValue className="text-left">
              {formatProductMeta(gpu.metas?.performanceRank)}
            </CustomRowValue>
          </CustomRow>
        ))}
      </TBody>
    </Table>
  );
};
