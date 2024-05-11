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
  const { gpus, query } = useListContext();
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
            <Th className="text-center px-4 py-2 sm:px-2 md:px-3">
              <span className="sm:hidden">#</span>
              <span className="hidden sm:block">
                <HashtagIcon className="w-4 mx-auto" />
              </span>
            </Th>
          ) : (
            <></>
          )}

          <Th className="px-4 py-2 md:p-2">Graphics Card</Th>

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
              'text-center px-4 py-2 whitespace-nowrap sm:px-2 md:px-3 md:border-r-px',
              sort !== ListSort.ReleaseDate ? '2xs:hidden' : '2xs:border-r-px',
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
        {gpus.map((gpu, i) => (
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
          'text-center text-base px-4 py-2 sm:px-2 md:px-3 md:border-r-px',
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
