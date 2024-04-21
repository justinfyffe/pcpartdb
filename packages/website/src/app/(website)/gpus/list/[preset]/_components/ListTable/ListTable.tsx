'use client';

import { HashtagIcon } from '@heroicons/react/24/outline';
import {
  BenchmarkKey,
  formatProductName,
  getProductBenchmarkShortName,
  getProductPerformanceRank,
  getProductValueRank,
  getViewGpuPath,
  GpuProduct,
  ListSort,
  productBenchmarkValue,
  productBenchmarkValuePerMsrp,
  productFieldFormattedValue,
  ProductType,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { showDialog } from 'packages/website/src/app/_common/components/Dialog/dialog';
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
import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { useListContext } from '../../ListProvider';
import { RetailModelsDialog } from '../RetailModelsDialog/RetailModelsDialog';

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
              <span className="sm:hidden">Rank</span>
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

          <Th className="text-center px-4 py-2 whitespace-nowrap md:hidden sm:px-2 md:px-3">
            Retail
            <br />
            Cards
          </Th>
        </Tr>
      </THead>

      <TBody>
        {gpus.map((gpu) => (
          <ListTableRow key={gpu.id} gpu={gpu} sort={sort} />
        ))}
      </TBody>
    </Table>
  );
};

interface ListTableRowProps {
  gpu: GpuProduct;
  sort: ListSort;
}

const ListTableRow: FunctionComponent<ListTableRowProps> = (props) => {
  const { gpu } = props;
  const { additionalData, query } = useListContext();
  const sort = query?.orderBy?.sort ?? ListSort.PerformanceRating;
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);

  const retailModelsCount = additionalData?.retailModelCounts?.[gpu.id] ?? 0;

  const href = useMemo(() => getViewGpuPath(gpu), [gpu]);
  const name = useMemo(() => formatProductName(gpu), [gpu]);
  const rank = useMemo(
    () =>
      hasRank(sort) ? getRank(gpu, preferredBenchmark, sort) ?? '--' : null,
    [gpu, preferredBenchmark, sort],
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

  const openProductsDialog = useCallback(() => {
    showDialog(<RetailModelsDialog chipset={gpu} />);
  }, [gpu]);

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

      <Td className="text-center md:hidden px-4 py-2 sm:px-2 md:px-3">
        {retailModelsCount > 0 && (
          <Button
            variant={ButtonVariant.Link}
            onClick={openProductsDialog}
            className="cursor-pointer p-0"
          >
            {retailModelsCount === 1 && <>1 card</>}
            {retailModelsCount > 1 && <>{retailModelsCount} cards</>}
          </Button>
        )}
        {retailModelsCount === 0 && <>--</>}
      </Td>
    </Tr>
  );
};

function hasRank(sort: ListSort) {
  return (
    sort === ListSort.PerformanceRating || sort === ListSort.PerformancePerMsrp
  );
}

function getRank(product: GpuProduct, benchmark: BenchmarkKey, sort: ListSort) {
  if (sort == null || sort === ListSort.PerformanceRating) {
    return getProductPerformanceRank(product, benchmark);
  } else if (sort === ListSort.PerformancePerMsrp) {
    return getProductValueRank(product, benchmark);
  }

  return null;
}
