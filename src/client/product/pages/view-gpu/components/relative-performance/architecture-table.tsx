import { formatSpec, getGpuName, getViewGpuSlug } from '@client/product';
import { Table, TBody, Th, THead, Tr } from '@client/shared/components';
import { getViewGpuPath } from '@client/shared/website';
import { Product } from '@shared/product';
import React, { FunctionComponent, useCallback, useContext } from 'react';
import { ViewPageContext } from '../../context';
import { CustomRow, CustomRowLabel, CustomRowValue } from '../custom-row';

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

  const getRelativePerformance = useCallback(
    (relatedGpu: Product) => {
      const baseline = product.benchmarks.performanceScore.value;
      const relatedPerformance = relatedGpu.benchmarks.performanceScore.value;

      return ((relatedPerformance / baseline) * 100).toFixed(0);
    },
    [product],
  );

  const seedIndex = gpus.findIndex((gpu) => product.id === gpu.id);
  const company = formatSpec(product.specs?.company);
  const architecture = formatSpec(product.specs?.architecture);

  return (
    <>
      <h3 className="mb-1">
        Compared to {company} {architecture} GPUs
      </h3>
      <Table border responsive className={className}>
        <THead>
          <Tr>
            <Th></Th>
            <Th className="text-left">Relative Performance</Th>
            <Th className="text-right">Rank</Th>
          </Tr>
        </THead>
        <TBody>
          {gpus.map((gpu, i) => {
            return (
              <CustomRow key={i} highlight={product.id === gpu.id}>
                <CustomRowLabel>
                  {i === seedIndex ? (
                    <>{getGpuName(gpu, { company: false })}</>
                  ) : (
                    <a href={getViewGpuPath(getViewGpuSlug(gpu))}>
                      {getGpuName(gpu, { company: false })}
                    </a>
                  )}
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
    </>
  );
};
