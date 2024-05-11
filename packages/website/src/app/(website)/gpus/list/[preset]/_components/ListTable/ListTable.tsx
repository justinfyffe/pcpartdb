'use client';

import { HashtagIcon } from '@heroicons/react/24/outline';
import {
  formatProductName,
  getProductBenchmarkShortName,
  getViewGpuPath,
  GpuProduct,
  ListOrder,
  ListPagination,
  ListSort,
  productBenchmarkValue,
  productBenchmarkValuePerMsrp,
  productFieldFormattedValue,
  ProductType,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { Img } from 'packages/website/src/app/_common/components/Img/Img';
import { Table } from 'packages/website/src/app/_common/components/Table/Table';
import { TBody } from 'packages/website/src/app/_common/components/Table/TBody';
import { Td } from 'packages/website/src/app/_common/components/Table/Td';
import { Th } from 'packages/website/src/app/_common/components/Table/Th';
import { THead } from 'packages/website/src/app/_common/components/Table/THead';
import { Tr } from 'packages/website/src/app/_common/components/Table/Tr';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmark';
import { usePreferredBenchmarkDialog } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmarkDialog';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import { companyLogoAutocompletePath } from 'packages/website/src/app/_common/utils/companyLogoAutocompletePath';
import React, { FunctionComponent, useMemo } from 'react';
import { useListContext } from '../../ListProvider';

export const ListTable: FunctionComponent = () => {
  const { gpus, query, loading } = useListContext();
  const sort = query?.orderBy?.sort ?? ListSort.PerformanceRating;
  const showRanks = hasRank(sort);

  const showPreferredBenchmarkDialog = usePreferredBenchmarkDialog({
    productType: ProductType.Gpu,
    hardReload: true,
  });

  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const benchmarkLabel = getProductBenchmarkShortName(preferredBenchmark);

  return (
    <Table border className="flex-1 w-full">
      <THead>
        <Tr sticky>
          {showRanks ? (
            <Th className="text-center px-4 py-2 sm:px-2 md:px-3 min-w-18 md:min-w-0">
              <span className="sm:hidden">#</span>
              <span className="hidden sm:block">
                <HashtagIcon className="w-4 mx-auto" />
              </span>
            </Th>
          ) : (
            <></>
          )}

          <Th className="px-4 py-2 md:p-2 min-w-64 md:min-w-12">
            Graphics Card
          </Th>

          <Th
            className={classNames(
              'text-center px-4 py-2 whitespace-nowrap sm:px-2 md:px-3 min-w-18 md:min-w-0',
              sort !== ListSort.PerformanceRating
                ? 'xs:hidden'
                : 'xs:border-r-px',
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
              'text-center px-4 py-2 whitespace-nowrap sm:px-2 md:px-3 min-w-18 md:min-w-0',
              sort !== ListSort.PerformancePerMsrp
                ? 'xs:hidden'
                : 'xs:border-r-px',
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
              'text-center px-4 py-2 whitespace-nowrap sm:px-2 md:px-3 md:border-r-px min-w-18 md:min-w-0',
              sort !== ListSort.ReleaseDate ? 'xs:hidden' : 'xs:border-r-px',
            )}
          >
            <span className="hidden sm:block">Date</span>
            <span className="sm:hidden">
              Release
              <br />
              Date
            </span>
          </Th>
        </Tr>
      </THead>

      <TBody>
        {loading &&
          [...new Array(50)].map((_, i) => (
            <Tr key={i} className="animate-pulse">
              {showRanks ? (
                <Td className="py-4">
                  <div className="bg-loading w-12 xs:w-8 h-2 rounded-full mx-auto" />
                </Td>
              ) : (
                <></>
              )}
              <Td className="py-4">
                <div className="bg-loading w-64 md:w-32 xs:w-12 h-3 rounded-full" />
              </Td>
              <Td className="py-4">
                <div className="bg-loading w-12 xs:w-8 h-3 rounded-full mx-auto" />
              </Td>
              <Td className="py-4 xs:hidden">
                <div className="bg-loading w-12 xs:w-8 h-3 rounded-full mx-auto" />
              </Td>
              <Td className="py-4 xs:hidden">
                <div className="bg-loading w-12 xs:w-8 h-3 rounded-full mx-auto" />
              </Td>
            </Tr>
          ))}
        {!loading &&
          gpus.map((gpu, i) => (
            <ListTableRow key={gpu.id} gpu={gpu} index={i} />
          ))}
      </TBody>
    </Table>
  );
};

interface ListTableRowProps {
  gpu: GpuProduct;
  index: number;
}

const ListTableRow: FunctionComponent<ListTableRowProps> = (props) => {
  const { gpu, index } = props;
  const { query, totalGpus } = useListContext();
  const sort = query?.orderBy?.sort ?? ListSort.PerformanceRating;
  const order = query?.orderBy?.order;
  const pagination = query?.pagination;
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);

  const href = useMemo(() => getViewGpuPath(gpu), [gpu]);
  const name = useMemo(() => formatProductName(gpu), [gpu]);
  const rank = useMemo(
    () => getRank(sort, order, pagination, index, totalGpus),
    [index, order, pagination, sort, totalGpus],
  );
  const segment = useMemo(
    () => productFieldFormattedValue(gpu.fields?.marketSegment),
    [gpu.fields?.marketSegment],
  );
  const performance = useMemo(() => {
    return (
      productBenchmarkValue(gpu, preferredBenchmark)?.toLocaleString() ?? '--'
    );
  }, [gpu, preferredBenchmark]);
  const performancePerDollar = useMemo(() => {
    return (
      productBenchmarkValuePerMsrp(gpu, preferredBenchmark)?.toLocaleString(
        'en-US',
        { maximumFractionDigits: 2 },
      ) ?? '--'
    );
  }, [gpu, preferredBenchmark]);
  const releaseDate = useMemo(
    () => productFieldFormattedValue(gpu.fields.releaseDate) ?? '--',
    [gpu.fields.releaseDate],
  );

  const companyImage = useMemo(() => companyLogoAutocompletePath(gpu), [gpu]);

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

      <Td className="p-0 px-0 py-0">
        <a
          href={href}
          className="flex items-center gap-4 px-4 py-2 sm:px-2 md:px-3"
        >
          <div className="min-w-8 max-w-10 sm:hidden">
            <Img src={companyImage} />
          </div>

          <div>
            <span className="font-semibold">{name}</span>
            <div className="text-dimmed text-sm">{segment}</div>
          </div>
        </a>
      </Td>

      <Td
        className={classNames(
          'text-center text-base px-4 py-2 sm:px-2 md:px-3',
          sort !== ListSort.PerformanceRating ? 'xs:hidden' : 'xs:border-r-px',
        )}
      >
        {performance}
      </Td>

      <Td
        className={classNames(
          'text-center text-base px-4 py-2 sm:px-2 md:px-3',
          sort !== ListSort.PerformancePerMsrp ? 'xs:hidden' : 'xs:border-r-px',
        )}
      >
        {performancePerDollar}
      </Td>

      <Td
        className={classNames(
          'text-center text-base px-4 py-2 sm:px-2 md:px-3 md:border-r-px',
          sort !== ListSort.ReleaseDate ? 'xs:hidden' : 'xs:border-r-px',
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

function getRank(
  sort: ListSort,
  order: ListOrder,
  pagination: ListPagination,
  rawIndex: number,
  totalGpus: number,
) {
  if (!hasRank(sort)) {
    return null;
  }

  if (order === ListOrder.Asc) {
    return totalGpus - pagination.offset - rawIndex;
  } else {
    return pagination.offset + 1 + rawIndex;
  }
}
