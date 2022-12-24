import { Table, TBody, Th, THead, Tr } from '@client/shared/components';
import { getProductName, Product } from '@shared/product';
import React, { FunctionComponent, useCallback, useContext } from 'react';
import { ViewPageContext } from '../../context';
import { CustomRow, CustomRowLabel, CustomRowValue } from '../../custom-row';

interface ValueArchitectureTableProps {
  className?: string;
}

export const ValueArchitectureTable: FunctionComponent<
  ValueArchitectureTableProps
> = (props) => {
  const { className } = props;
  const { product, contentData } = useContext(ViewPageContext);
  const { valueArchitectureGpus: gpus, valueArchitectureRank: rank } =
    contentData;

  const seedIndex = gpus.findIndex((gpu) => product.id === gpu.id);

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
          <Th className="border-0"></Th>
          <Th className="text-left border-0">Relative Value</Th>
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
                {getRelativeValue(gpu)}%
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
