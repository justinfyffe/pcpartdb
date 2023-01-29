import { formatGpuBenchmark, getShoppingUrl } from '@client/gpus';
import { Table, TBody } from '@client/shared/components';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../context';
import { CustomRow, CustomRowLabel, CustomRowValue } from '../custom-row';
import { SpecRow } from '../spec-row';

interface GeneralInfoTableProps {
  className?: string;
}

export const GeneralInfoTable: FunctionComponent<GeneralInfoTableProps> = (
  props,
) => {
  const { className } = props;
  const { gpu } = useContext(ViewPageContext);
  const { benchmarks, ranks } = gpu;

  const shoppingUrl = getShoppingUrl(gpu);

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
            ranks.performanceRank != null ? (
              <>
                {formatGpuBenchmark(benchmarks.performanceScore)} (
                {ranks.performanceRank})
              </>
            ) : (
              <>--</>
            )}
          </CustomRowValue>
        </CustomRow>
        <CustomRow>
          <CustomRowLabel>Performance Per Dollar (Rank)</CustomRowLabel>
          <CustomRowValue>
            {benchmarks.valueScore != null && ranks.valueRank != null ? (
              <>
                {formatGpuBenchmark(benchmarks.valueScore)} ({ranks.valueRank})
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
