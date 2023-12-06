import { HashtagIcon } from '@heroicons/react/24/outline';
import {
  formatProductName,
  getViewGpuPath,
  GpuProduct,
  ListSort,
  productFieldFormattedValue,
  productRankValue,
  RankKey,
} from '@pcpartdb/shared';
import {
  Button,
  ButtonVariant,
} from 'packages/website/src/client/shared/components/Button/Button';
import { showDialog } from 'packages/website/src/client/shared/components/Dialog/dialog';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { ListPageContext } from '../../context/ListPageContext';
import { RetailModelsDialog } from '../RetailModelsDialog';

export const ListTable: FunctionComponent = () => {
  const { gpus, query } = useContext(ListPageContext);
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

          <Th className="px-4 py-2 md:p-2">GPU</Th>

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

          <Th className="text-right px-4 py-2 whitespace-nowrap md:hidden sm:px-2 md:px-3">
            Retail Models
          </Th>
        </Tr>
      </THead>

      <TBody>
        {gpus.map((gpu) => (
          <ListTableRow rankKey={rankKey} key={gpu.id} gpu={gpu} />
        ))}
      </TBody>
    </Table>
  );
};

interface ListTableRowProps {
  rankKey?: RankKey;
  gpu: GpuProduct;
}

const ListTableRow: FunctionComponent<ListTableRowProps> = (props) => {
  const { rankKey, gpu } = props;
  const { additionalData, query } = useContext(ListPageContext);
  const sort = query?.orderBy?.sort ?? ListSort.PerformanceRating;

  const retailModelsCount = additionalData?.retailModelCounts?.[gpu.id] ?? 0;

  const href = useMemo(() => getViewGpuPath(gpu), [gpu]);
  const name = useMemo(() => formatProductName(gpu), [gpu]);
  const rank = useMemo(() => productRankValue(gpu, rankKey), [gpu, rankKey]);
  const segment = useMemo(
    () => productFieldFormattedValue(gpu.fields?.marketSegment),
    [gpu.fields?.marketSegment],
  );
  const performance = useMemo(() => {
    return productFieldFormattedValue(gpu.fields.performanceRating) ?? '--';
  }, [gpu.fields.performanceRating]);
  const performancePerDollar = useMemo(() => {
    return productFieldFormattedValue(gpu.fields.performancePerMsrp) ?? '--';
  }, [gpu.fields.performancePerMsrp]);
  const releaseDate = useMemo(
    () => productFieldFormattedValue(gpu.fields.releaseDate) ?? '--',
    [gpu.fields.releaseDate],
  );

  const openProductsDialog = useCallback(() => {
    showDialog(<RetailModelsDialog chipset={gpu} />);
  }, [gpu]);

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

      <Td className="text-right md:hidden px-4 py-2 sm:px-2 md:px-3">
        {retailModelsCount > 0 && (
          <Button
            variant={ButtonVariant.Link}
            onClick={openProductsDialog}
            className="cursor-pointer p-0"
          >
            {retailModelsCount === 1 && <>1 product</>}
            {retailModelsCount > 1 && <>{retailModelsCount} products</>}
          </Button>
        )}
        {retailModelsCount === 0 && <>--</>}
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
