import { Table, TBody } from '@client/shared/components';
import { formatBenchmark } from '@shared/benchmark';
import { formatProductMeta } from '@shared/product-meta';
import { getShoppingUrl } from '@shared/retail-model';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../context';
import { CustomRow, CustomRowLabel, CustomRowValue } from '../../custom-row';
import { SpecRow } from '../../spec-row';

interface GeneralInfoTableProps {
  className?: string;
}

export const GeneralInfoTable: FunctionComponent<GeneralInfoTableProps> = (
  props,
) => {
  const { className } = props;
  const { product } = useContext(ViewPageContext);
  const { benchmarks, metas } = product;

  const shoppingUrl = getShoppingUrl(product);

  return (
    <Table border responsive className={className}>
      <TBody>
        <CustomRow>
          <CustomRowLabel>Shop</CustomRowLabel>
          <CustomRowValue>
            {shoppingUrl != null ? (
              <a
                href={shoppingUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-green-600 font-bold"
              >
                Check current price
              </a>
            ) : (
              <>--</>
            )}
          </CustomRowValue>
        </CustomRow>
        <CustomRow>
          <CustomRowLabel>Performance Rating (Rank)</CustomRowLabel>
          <CustomRowValue>
            {benchmarks.performanceScore != null &&
            metas.performanceRank != null ? (
              <>
                {formatBenchmark(benchmarks.performanceScore)} (
                {formatProductMeta(metas.performanceRank)})
              </>
            ) : (
              <>--</>
            )}
          </CustomRowValue>
        </CustomRow>
        <CustomRow>
          <CustomRowLabel>Performance Per Dollar (Rank)</CustomRowLabel>
          <CustomRowValue>
            {benchmarks.valueScore != null && metas.valueRank != null ? (
              <>
                {formatBenchmark(benchmarks.valueScore)} (
                {formatProductMeta(metas.valueRank)})
              </>
            ) : (
              <>--</>
            )}
          </CustomRowValue>
        </CustomRow>
        <SpecRow spec="company" />
        <SpecRow spec="architecture" />
        <SpecRow spec="marketSegment" />
        <SpecRow spec="releaseDate" />
        <SpecRow spec="launchPrice" />
      </TBody>
    </Table>
  );
};
