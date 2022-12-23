import { Table, TBody, Th, THead, Tr } from '@client/shared/components';
import { getProductName } from '@shared/product';
import { formatProductMeta } from '@shared/product-meta';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../context';
import { CustomRow, CustomRowLabel, CustomRowValue } from '../../custom-row';

interface PerformanceYearTableProps {
  className?: string;
}

export const PerformanceYearTable: FunctionComponent<
  PerformanceYearTableProps
> = (props) => {
  const { className } = props;
  const { product, contentData } = useContext(ViewPageContext);
  const { performanceYearGpus: launchYearGpus } = contentData;

  const baseline = product.benchmarks?.performanceScore?.value;

  const relativePerformance = launchYearGpus.map((gpu) => {
    const performance = gpu.benchmarks?.performanceScore?.value;

    if (performance == null || baseline == null) {
      return null;
    }

    return ((performance / baseline) * 100).toFixed(0);
  });

  // TODO: use relative rank, not overall rank
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
        {launchYearGpus.map((gpu, i) => {
          return (
            <CustomRow key={i} highlight={product.id === gpu.id}>
              <CustomRowLabel>
                {getProductName(gpu, { company: false })}
              </CustomRowLabel>
              <CustomRowValue className="text-left">
                {(relativePerformance[i] != null) != null ? (
                  <>{relativePerformance[i]}%</>
                ) : (
                  '--'
                )}
              </CustomRowValue>
              <CustomRowValue className="text-right">
                {formatProductMeta(gpu.metas.performanceRank)}
              </CustomRowValue>
            </CustomRow>
          );
        })}
      </TBody>
    </Table>
  );
};
