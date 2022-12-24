import { Table, TBody, Th, THead, Tr } from '@client/shared/components';
import { getProductName, Product } from '@shared/product';
import React, { FunctionComponent, useCallback, useContext } from 'react';
import { ViewPageContext } from '../../context';
import { CustomRow, CustomRowLabel, CustomRowValue } from '../../custom-row';

interface PerformanceArchitectureTableProps {
  className?: string;
}

export const PerformanceArchitectureTable: FunctionComponent<
  PerformanceArchitectureTableProps
> = (props) => {
  const { className } = props;
  const { product, contentData } = useContext(ViewPageContext);
  const {
    performanceArchitectureGpus: gpus,
    performanceArchitectureRank: rank,
  } = contentData;

  const seedIndex = gpus.findIndex((gpu) => product.id === gpu.id);

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
          <Th className="border-0"></Th>
          <Th className="text-left border-0">Relative Performance</Th>
          <Th className="text-right border-0">Rank</Th>
        </Tr>
      </THead>
      <TBody>
        {gpus.map((gpu, i) => {
          return (
            <CustomRow key={i} highlight={product.id === gpu.id}>
              <CustomRowLabel>
                {getProductName(gpu, { company: false })}
              </CustomRowLabel>
              <CustomRowValue className="text-left">
                {getRelativePerformance(gpu)}%
              </CustomRowValue>
              <CustomRowValue className="text-right">
                {rank - (seedIndex - i)}
              </CustomRowValue>
            </CustomRow>
          );
        })}
      </TBody>
    </Table>
  );
};
