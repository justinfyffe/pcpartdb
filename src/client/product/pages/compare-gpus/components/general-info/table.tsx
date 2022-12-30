import { getGpuName } from '@client/product';
import { Table, TBody, Th, THead, Tr } from '@client/shared/components';
import { formatBenchmark } from '@shared/benchmark';
import { formatProductMeta } from '@shared/product-meta';
import { getShoppingUrl } from '@shared/retail-model';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../context';
import { CustomRow, CustomRowLabel, CustomRowValue } from '../custom-row';
import { SpecRow } from '../spec-row';

interface GeneralInfoTableProps {
  className?: string;
}

export const GeneralInfoTable: FunctionComponent<GeneralInfoTableProps> = (
  props,
) => {
  const { className } = props;
  const { comparison } = useContext(ComparePageContext);
  const [product1, product2] = comparison;

  const benchmarks1 = product1.benchmarks;
  const metas1 = product1.metas;
  const benchmarks2 = product2.benchmarks;
  const metas2 = product2.metas;

  const shoppingUrl1 = getShoppingUrl(product1);
  const shoppingUrl2 = getShoppingUrl(product2);

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th></Th>
          <Th>{getGpuName(product1, { company: false })}</Th>
          <Th>{getGpuName(product2, { company: false })}</Th>
        </Tr>
      </THead>
      <TBody>
        <CustomRow>
          <CustomRowLabel>Shop</CustomRowLabel>
          <CustomRowValue>
            {shoppingUrl1 != null ? (
              <a
                href={shoppingUrl1}
                target="_blank"
                rel="noreferrer noopener"
                className="text-green-600 font-bold"
              >
                Check Price
              </a>
            ) : (
              <>--</>
            )}
          </CustomRowValue>
          <CustomRowValue>
            {shoppingUrl2 != null ? (
              <a
                href={shoppingUrl2}
                target="_blank"
                rel="noreferrer noopener"
                className="text-green-600 font-bold"
              >
                Check Price
              </a>
            ) : (
              <>--</>
            )}
          </CustomRowValue>
        </CustomRow>
        <CustomRow>
          <CustomRowLabel>Performance Rating (Rank)</CustomRowLabel>
          <CustomRowValue>
            {benchmarks1.performanceScore != null &&
            metas1.performanceRank != null ? (
              <>
                {formatBenchmark(benchmarks1.performanceScore)} (
                {formatProductMeta(metas1.performanceRank)})
              </>
            ) : (
              <>--</>
            )}
          </CustomRowValue>
          <CustomRowValue>
            {benchmarks2.performanceScore != null &&
            metas2.performanceRank != null ? (
              <>
                {formatBenchmark(benchmarks2.performanceScore)} (
                {formatProductMeta(metas2.performanceRank)})
              </>
            ) : (
              <>--</>
            )}
          </CustomRowValue>
        </CustomRow>
        <CustomRow>
          <CustomRowLabel>Performance Per Dollar (Rank)</CustomRowLabel>
          <CustomRowValue>
            {benchmarks1.valueScore != null && metas1.valueRank != null ? (
              <>
                {formatBenchmark(benchmarks1.valueScore)} (
                {formatProductMeta(metas1.valueRank)})
              </>
            ) : (
              <>--</>
            )}
          </CustomRowValue>
          <CustomRowValue>
            {benchmarks2.valueScore != null && metas2.valueRank != null ? (
              <>
                {formatBenchmark(benchmarks2.valueScore)} (
                {formatProductMeta(metas2.valueRank)})
              </>
            ) : (
              <>--</>
            )}
          </CustomRowValue>
        </CustomRow>
        <SpecRow spec="company" />
        <SpecRow spec="marketSegment" />
        <SpecRow spec="releaseDate" />
        <SpecRow spec="launchPrice" />
      </TBody>
    </Table>
  );
};
