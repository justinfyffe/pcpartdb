import { formatSpec, getGpuName, getViewGpuSlug } from '@client/product';
import { Table, TBody, Th, THead, Tr } from '@client/shared/components';
import { DateFormatter } from '@client/shared/format';
import { getViewGpuPath } from '@client/shared/website';
import { Product } from '@shared/product';
import React, { FunctionComponent, useCallback, useContext } from 'react';
import { ViewPageContext } from '../../context';
import { CustomRow, CustomRowLabel, CustomRowValue } from '../custom-row';

interface PerformanceYearTableProps {
  className?: string;
}

export const PerformanceYearTable: FunctionComponent<
  PerformanceYearTableProps
> = (props) => {
  const { className } = props;
  const { product, contentData } = useContext(ViewPageContext);
  const { performanceYearGpus: gpus, performanceYearRank } = contentData;

  const getRelativePerformance = useCallback(
    (relatedGpu: Product) => {
      const baseline = product.benchmarks.performanceScore.value;
      const relatedPerformance = relatedGpu.benchmarks.performanceScore.value;

      return ((relatedPerformance / baseline) * 100).toFixed(0);
    },
    [product],
  );

  const seedIndex = gpus.findIndex((gpu) => product.id === gpu.id);
  const year = formatSpec(product.specs?.releaseDate, {
    dateFormatter: DateFormatter.Year,
  });

  return (
    <>
      <h3 className="mb-1">Compared to {year} GPUs</h3>
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
              <CustomRow key={i} highlight={i === seedIndex}>
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
                  {performanceYearRank - (seedIndex - i)}
                </CustomRowValue>
              </CustomRow>
            );
          })}
        </TBody>
      </Table>
    </>
  );
};
