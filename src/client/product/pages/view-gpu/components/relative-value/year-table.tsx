import { formatSpec, getGpuName } from '@client/product';
import { Table, TBody, Th, THead, Tr } from '@client/shared/components';
import { DateFormatter } from '@client/shared/format';
import { Product } from '@shared/product';
import React, { FunctionComponent, useCallback, useContext } from 'react';
import { ViewPageContext } from '../../context';
import { CustomRow, CustomRowLabel, CustomRowValue } from '../custom-row';

interface ValueYearTableProps {
  className?: string;
}

export const ValueYearTable: FunctionComponent<ValueYearTableProps> = (
  props,
) => {
  const { className } = props;
  const { product, contentData } = useContext(ViewPageContext);
  const { valueYearGpus: gpus, valueYearRank } = contentData;

  const getRelativeValue = useCallback(
    (relatedGpu: Product) => {
      const baseline = product.benchmarks.valueScore.value;
      const relatedValue = relatedGpu.benchmarks.valueScore.value;

      return ((relatedValue / baseline) * 100).toFixed(0);
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
            <Th className="text-left border-0">Relative Value</Th>
            <Th className="text-right border-0">Rank</Th>
          </Tr>
        </THead>
        <TBody>
          {gpus.map((gpu, i) => {
            return (
              <CustomRow key={gpu.id} highlight={i === seedIndex}>
                <CustomRowLabel>
                  {getGpuName(gpu, { company: false })}
                </CustomRowLabel>
                <CustomRowValue className="text-left">
                  {getRelativeValue(gpu)}%
                </CustomRowValue>
                <CustomRowValue className="text-right">
                  {valueYearRank - (seedIndex - i)}
                </CustomRowValue>
              </CustomRow>
            );
          })}
        </TBody>
      </Table>
    </>
  );
};
