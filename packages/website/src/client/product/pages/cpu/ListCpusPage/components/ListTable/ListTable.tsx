import { HashtagIcon } from '@heroicons/react/24/outline';
import {
  BenchmarkKey,
  CpuProduct,
  formatProductName,
  getProductBenchmarkShortName,
  getProductPerformanceRank,
  getProductValueRank,
  getViewCpuPath,
  ListSort,
  productBenchmarkValue,
  productBenchmarkValuePerMsrp,
  productFieldFormattedValue,
  ProductType,
} from '@pcpartdb/shared';
import {
  Button,
  ButtonVariant,
} from 'packages/website/src/client/shared/components/Button/Button';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import { usePreferredBenchmark } from 'packages/website/src/client/user/hooks/usePreferredBenchmark';
import { usePreferredBenchmarkDialog } from 'packages/website/src/client/user/hooks/usePreferredBenchmarkDialog';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ListPageContext } from '../../context/ListPageContext';

export const ListTable: FunctionComponent = () => {
  const { cpus, query } = useContext(ListPageContext);
  const sort = query?.orderBy?.sort ?? ListSort.PerformanceRating;
  const showRanks = hasRank(sort);

  const showPreferredBenchmarkDialog = usePreferredBenchmarkDialog({
    productType: ProductType.Cpu,
    hardReload: true,
  });

  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);
  const benchmarkLabel = getProductBenchmarkShortName(preferredBenchmark);

  return (
    <Table border className="flex-1 w-full">
      <THead>
        <Tr sticky>
          {showRanks ? (
            <Th className="text-center px-4 py-2 sm:px-2 md:px-3">
              <span className="sm:hidden">Rank</span>
              <span className="hidden sm:block">
                <HashtagIcon className="w-4 mx-auto" />
              </span>
            </Th>
          ) : (
            <></>
          )}

          <Th className="px-4 py-2 md:p-2">CPU</Th>

          <Th
            className={classNames(
              'text-center px-4 py-2 whitespace-nowrap sm:px-2 md:px-3',
              sort !== ListSort.PerformanceRating
                ? '2xs:hidden'
                : '2xs:border-r-px',
            )}
          >
            <Button
              variant={ButtonVariant.Link}
              onClick={showPreferredBenchmarkDialog}
            >
              <span className="hidden sm:block">Perf.</span>
              <span className="sm:hidden">
                Performance:
                <br />
                {benchmarkLabel}
              </span>
            </Button>
          </Th>

          <Th
            className={classNames(
              'text-center px-4 py-2 whitespace-nowrap sm:px-2 md:px-3',
              sort !== ListSort.PerformancePerMsrp
                ? '2xs:hidden'
                : '2xs:border-r-px',
            )}
          >
            <Button
              variant={ButtonVariant.Link}
              onClick={showPreferredBenchmarkDialog}
            >
              <span className="hidden sm:block">Perf. / $</span>
              <span className="sm:hidden">
                Performance
                <br />
                per dollar
              </span>
            </Button>
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
          <ListTableRow key={cpu.id} cpu={cpu} sort={sort} />
        ))}
      </TBody>
    </Table>
  );
};

interface ListTableRowProps {
  cpu: CpuProduct;
  sort: ListSort;
}

const ListTableRow: FunctionComponent<ListTableRowProps> = (props) => {
  const { cpu } = props;
  const { query } = useContext(ListPageContext);
  const sort = query?.orderBy?.sort ?? ListSort.PerformanceRating;
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);

  const href = useMemo(() => getViewCpuPath(cpu), [cpu]);
  const name = useMemo(() => formatProductName(cpu), [cpu]);
  const rank = useMemo(
    () =>
      hasRank(sort) ? getRank(cpu, preferredBenchmark, sort) ?? '--' : null,
    [cpu, preferredBenchmark, sort],
  );
  const segment = useMemo(
    () => productFieldFormattedValue(cpu.fields?.marketSegment),
    [cpu.fields?.marketSegment],
  );
  const performance = useMemo(() => {
    return (
      productBenchmarkValue(cpu, preferredBenchmark)?.toLocaleString() ?? '--'
    );
  }, [cpu, preferredBenchmark]);
  const performancePerDollar = useMemo(() => {
    return (
      productBenchmarkValuePerMsrp(cpu, preferredBenchmark)?.toLocaleString(
        'en-US',
        { maximumFractionDigits: 2 },
      ) ?? '--'
    );
  }, [cpu, preferredBenchmark]);
  const releaseDate = useMemo(
    () => productFieldFormattedValue(cpu.fields?.releaseDate) ?? '--',
    [cpu.fields?.releaseDate],
  );

  return (
    <Tr>
      {rank != null ? (
        <>
          <Td className="text-center text-base px-4 py-2 sm:px-2 md:px-3">
            {rank?.toLocaleString() || '--'}
          </Td>
        </>
      ) : (
        <></>
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
          'text-center text-base px-4 py-2 sm:px-2 md:px-3',
          sort !== ListSort.PerformanceRating
            ? '2xs:hidden'
            : '2xs:border-r-px',
        )}
      >
        {performance}
      </Td>

      <Td
        className={classNames(
          'text-center text-base px-4 py-2 sm:px-2 md:px-3',
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

function hasRank(sort: ListSort) {
  return (
    sort === ListSort.PerformanceRating || sort === ListSort.PerformancePerMsrp
  );
}

function getRank(product: CpuProduct, benchmark: BenchmarkKey, sort: ListSort) {
  if (sort == null || sort === ListSort.PerformanceRating) {
    return getProductPerformanceRank(product, benchmark);
  } else if (sort === ListSort.PerformancePerMsrp) {
    return getProductValueRank(product, benchmark);
  }

  return null;
}
