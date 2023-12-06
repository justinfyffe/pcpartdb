import { HashtagIcon } from '@heroicons/react/24/outline';
import {
  CpuProduct,
  formatProductName,
  getViewCpuPath,
  ListSort,
  productFieldFormattedValue,
  productRankValue,
  RankKey,
} from '@pcpartdb/shared';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ListPageContext } from '../../context/ListPageContext';

export const ListTable: FunctionComponent = () => {
  const { cpus, query } = useContext(ListPageContext);
  const rankKey = getRankKey(query?.orderBy?.sort);
  const sort = query?.orderBy?.sort ?? ListSort.PerformanceRating;

  return (
    <Table border className="flex-1 w-full">
      <THead>
        <Tr sticky>
          {rankKey != null && (
            <Th className="text-center px-4 py-2 sm:px-2 md:px-3">
              <span className="sm:hidden">Rank</span>
              <span className="hidden sm:block">
                <HashtagIcon className="w-4 mx-auto" />
              </span>
            </Th>
          )}

          <Th className="px-4 py-2 md:p-2">CPU</Th>

          <Th
            className={classNames(
              'text-right px-4 py-2 whitespace-nowrap sm:px-2 md:px-3',
              sort !== ListSort.PerformanceRating
                ? '2xs:hidden'
                : '2xs:border-r-px',
            )}
          >
            <span className="hidden sm:block">Perf.</span>
            <span className="sm:hidden">Performance</span>
          </Th>

          <Th
            className={classNames(
              'text-right px-4 py-2 whitespace-nowrap sm:px-2 md:px-3',
              sort !== ListSort.PerformancePerMsrp
                ? '2xs:hidden'
                : '2xs:border-r-px',
            )}
          >
            <span className="hidden sm:block">Value</span>
            <span className="sm:hidden">Value</span>
          </Th>

          <Th
            className={classNames(
              'text-right px-4 py-2 whitespace-nowrap sm:px-2 md:px-3 md:border-r-px',
              sort !== ListSort.ReleaseDate ? '2xs:hidden' : '2xs:border-r-px',
            )}
          >
            <span className="hidden sm:block">Date</span>
            <span className="sm:hidden">Release Date</span>
          </Th>
        </Tr>
      </THead>

      <TBody>
        {cpus.map((cpu) => (
          <ListTableRow rankKey={rankKey} key={cpu.id} cpu={cpu} />
        ))}
      </TBody>
    </Table>
  );
};

interface ListTableRowProps {
  rankKey?: RankKey;
  cpu: CpuProduct;
}

const ListTableRow: FunctionComponent<ListTableRowProps> = (props) => {
  const { rankKey, cpu } = props;
  const { query } = useContext(ListPageContext);
  const sort = query?.orderBy?.sort ?? ListSort.PerformanceRating;

  const href = useMemo(() => getViewCpuPath(cpu), [cpu]);
  const name = useMemo(() => formatProductName(cpu), [cpu]);
  const rank = useMemo(() => productRankValue(cpu, rankKey), [cpu, rankKey]);
  const segment = useMemo(
    () => productFieldFormattedValue(cpu.fields?.marketSegment),
    [cpu.fields?.marketSegment],
  );
  const performance = useMemo(() => {
    return productFieldFormattedValue(cpu.fields?.performanceRating) ?? '--';
  }, [cpu.fields?.performanceRating]);
  const performancePerDollar = useMemo(() => {
    return productFieldFormattedValue(cpu.fields?.performancePerMsrp) ?? '--';
  }, [cpu.fields?.performancePerMsrp]);
  const releaseDate = useMemo(
    () => productFieldFormattedValue(cpu.fields?.releaseDate) ?? '--',
    [cpu.fields?.releaseDate],
  );

  return (
    <Tr>
      {rankKey != null && (
        <>
          <Td className="text-center text-base px-4 py-2 sm:px-2 md:px-3">
            {rank?.toLocaleString() || '--'}
          </Td>
        </>
      )}

      <Td className="px-4 py-2 sm:px-2 md:px-3">
        <div>
          <a href={href} className="font-semibold text-base">
            {name}
          </a>
        </div>
        <div className="text-dimmed text-sm">{segment}</div>
      </Td>

      <Td
        className={classNames(
          'text-right text-base px-4 py-2 sm:px-2 md:px-3',
          sort !== ListSort.PerformanceRating
            ? '2xs:hidden'
            : '2xs:border-r-px',
        )}
      >
        {performance}
      </Td>

      <Td
        className={classNames(
          'text-right text-base px-4 py-2 sm:px-2 md:px-3',
          sort !== ListSort.PerformancePerMsrp
            ? '2xs:hidden'
            : '2xs:border-r-px',
        )}
      >
        {performancePerDollar}
      </Td>

      <Td
        className={classNames(
          'text-right text-base px-4 py-2 sm:px-2 md:px-3 md:border-r-px',
          sort !== ListSort.ReleaseDate ? '2xs:hidden' : '2xs:border-r-px',
        )}
      >
        {releaseDate}
      </Td>
    </Tr>
  );
};

function getRankKey(sort: ListSort) {
  if (sort == null || sort === ListSort.PerformanceRating) {
    return RankKey.PerformanceRating;
  } else if (sort === ListSort.PerformancePerMsrp) {
    return RankKey.PerformancePerMsrp;
  }

  return null;
}
