import { getGpuName, getViewGpuSlug } from '@client/product';
import { Table, TBody, Th, THead, Tr } from '@client/shared/components';
import { getViewGpuPath } from '@client/shared/website';
import { Product } from '@shared/product';
import { formatProductMeta } from '@shared/product-meta';
import React, { FunctionComponent, useCallback, useContext } from 'react';
import { ViewPageContext } from '../../context';
import { CustomRow, CustomRowLabel, CustomRowValue } from '../custom-row';

interface ValueTableProps {
  className?: string;
}

export const ValueTable: FunctionComponent<ValueTableProps> = (props) => {
  const { className } = props;
  const { product, contentData } = useContext(ViewPageContext);
  const { relativeValueGpus } = contentData;

  const getRelativeValue = useCallback(
    (relatedGpu: Product) => {
      const baseline = product.benchmarks.valueScore.value;
      const relatedValue = relatedGpu.benchmarks.valueScore.value;

      return ((relatedValue / baseline) * 100).toFixed(0);
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
        {relativeValueGpus.map((gpu) => (
          <CustomRow key={gpu.id} highlight={gpu.id === product.id}>
            <CustomRowLabel>
              <a href={getViewGpuPath(getViewGpuSlug(gpu))}>
                {getGpuName(gpu, { company: false })}
              </a>
            </CustomRowLabel>
            <CustomRowValue className="text-left">
              {getRelativeValue(gpu)}%
            </CustomRowValue>
            <CustomRowValue className="text-left">
              {formatProductMeta(gpu.metas?.valueRank)}
            </CustomRowValue>
          </CustomRow>
        ))}
      </TBody>
    </Table>
  );
};
