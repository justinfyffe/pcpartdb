import { getGpuName, getShoppingUrl } from '@client/part';
import { Table, TBody, Th, THead, Tr } from '@client/shared/components';
import { formatBenchmark } from '@shared/benchmark';
import { formatPartMeta } from '@shared/part-meta';
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
  const [part1, part2] = comparison;

  const benchmarks1 = part1.benchmarks;
  const metas1 = part1.metas;
  const benchmarks2 = part2.benchmarks;
  const metas2 = part2.metas;

  const shoppingUrl1 = getShoppingUrl(part1);
  const shoppingUrl2 = getShoppingUrl(part2);

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th></Th>
          <Th>{getGpuName(part1, { company: false })}</Th>
          <Th>{getGpuName(part2, { company: false })}</Th>
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
                {formatPartMeta(metas1.performanceRank)})
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
                {formatPartMeta(metas2.performanceRank)})
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
                {formatPartMeta(metas1.valueRank)})
              </>
            ) : (
              <>--</>
            )}
          </CustomRowValue>
          <CustomRowValue>
            {benchmarks2.valueScore != null && metas2.valueRank != null ? (
              <>
                {formatBenchmark(benchmarks2.valueScore)} (
                {formatPartMeta(metas2.valueRank)})
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
