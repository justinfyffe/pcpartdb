import {
  BenchmarkKey,
  formatAutomationSourceName,
  formatCompanyName,
  ProductDiff,
  ProductFieldKey,
  ProductType,
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
import React, { FunctionComponent } from 'react';
import { BenchmarkDiffRow } from './BenchmarkDiffRow';
import { FieldDiffRow } from './FieldDiffRow';
import { ProductGameDiffRow } from './ProductGameDiffRow';

interface FormattedDiffTabProps {
  productType: ProductType;
  dataToPreview: ProductFieldKey[];
  benchmarksToPreview?: BenchmarkKey[];
  diff: ProductDiff;
}

export const FormattedDiffTab: FunctionComponent<FormattedDiffTabProps> = (
  props,
) => {
  const { productType, dataToPreview, benchmarksToPreview, diff } = props;

  const hasNameChange = diff.original?.name !== diff.updated?.name;
  const hasSlugChange = diff.original?.slug !== diff.updated?.slug;
  const hasCompanyChange = diff.original?.company !== diff.updated?.company;
  const sources = diff.updated?.sources;

  const productGames = [
    ...(diff.original?.games ?? []),
    ...(diff.updated?.games ?? []),
  ].sort((pg1, pg2) =>
    (pg2?.game?.releaseDate ?? '').localeCompare(pg1?.game?.releaseDate ?? ''),
  );
  const gameIdsSet = new Set<number>(productGames.map((pg) => pg.gameId));
  const gameIds = [...gameIdsSet.values()];

  return (
    <div className="bg-white flex flex-col overflow-auto">
      <Table responsive border>
        <THead>
          <Tr sticky>
            <Th className="border-r-px w-[20%] font-bold">Field</Th>
            <Th className="w-[20%] font-bold">Before (Raw)</Th>
            <Th className="border-r-px w-[20%] font-bold">
              Before (Formatted)
            </Th>
            <Th className="w-[20%] font-bold">After (Raw)</Th>
            <Th className="w-[20%] font-bold">After (Formatted)</Th>
          </Tr>
        </THead>
        <TBody>
          <Tr>
            <Td
              className={classNames(
                'border-r-px',
                hasNameChange ? 'bg-yellow-100' : '',
              )}
            >
              Name
            </Td>
            <Td
              className={classNames(
                'border-r-px',
                hasNameChange ? 'bg-yellow-100' : '',
              )}
              colSpan={2}
            >
              {diff.original?.name ?? '--'}
            </Td>
            <Td className={hasNameChange ? 'bg-yellow-100' : ''} colSpan={2}>
              {diff.updated?.name ?? '--'}
            </Td>
          </Tr>

          <Tr>
            <Td
              className={classNames(
                'border-r-px',
                hasSlugChange ? 'bg-yellow-100' : '',
              )}
            >
              Slug
            </Td>
            <Td
              className={classNames(
                'border-r-px',
                hasSlugChange ? 'bg-yellow-100' : '',
              )}
              colSpan={2}
            >
              {diff.original?.slug ?? '--'}
            </Td>
            <Td className={hasSlugChange ? 'bg-yellow-100' : ''} colSpan={2}>
              {diff.updated?.slug ?? '--'}
            </Td>
          </Tr>

          <Tr>
            <Td
              className={classNames(
                'border-r-px',
                hasCompanyChange ? 'bg-yellow-100' : '',
              )}
            >
              Company
            </Td>
            <Td
              className={classNames(
                'border-r-px',
                hasCompanyChange ? 'bg-yellow-100' : '',
              )}
              colSpan={2}
            >
              {formatCompanyName(diff.original?.company) ?? '--'}
            </Td>
            <Td className={hasCompanyChange ? 'bg-yellow-100' : ''} colSpan={2}>
              {formatCompanyName(diff.updated?.company) ?? '--'}
            </Td>
          </Tr>

          <Tr>
            <Td
              className={classNames(
                'border-r-px',
                hasCompanyChange ? 'bg-yellow-100' : '',
              )}
            >
              Search Text
            </Td>
            <Td
              className={classNames(
                'border-r-px',
                hasCompanyChange ? 'bg-yellow-100' : '',
              )}
              colSpan={2}
            >
              {diff.original?.searchText ?? '--'}
            </Td>
            <Td className={hasCompanyChange ? 'bg-yellow-100' : ''} colSpan={2}>
              {diff.updated?.searchText ?? '--'}
            </Td>
          </Tr>

          <Tr>
            <Td
              className={classNames(
                'border-r-px',
                hasCompanyChange ? 'bg-yellow-100' : '',
              )}
            >
              Search Text
            </Td>
            <Td
              className={classNames(
                'border-r-px',
                hasCompanyChange ? 'bg-yellow-100' : '',
              )}
              colSpan={2}
            >
              {diff.original?.otherNames?.join(', ') ?? '--'}
            </Td>
            <Td className={hasCompanyChange ? 'bg-yellow-100' : ''} colSpan={2}>
              {diff.updated?.otherNames?.join(', ') ?? '--'}
            </Td>
          </Tr>

          {dataToPreview.map((previewKey) => (
            <FieldDiffRow
              key={previewKey}
              productType={productType}
              diffFieldKey={previewKey}
              diff={diff}
            />
          ))}

          {benchmarksToPreview.map((benchmarkKey) => (
            <BenchmarkDiffRow
              key={benchmarkKey}
              diffBenchmarkKey={benchmarkKey}
              diff={diff}
            />
          ))}

          {gameIds.map((gameId) => (
            <ProductGameDiffRow key={gameId} diff={diff} diffGameId={gameId} />
          ))}

          {sources.map((source) => (
            <Tr key={source.sourceKey}>
              <Td>{formatAutomationSourceName(source.sourceKey)}</Td>
              <Td colSpan={2} />
              <Td colSpan={2}>
                <a
                  href={source.sourceUrl}
                  target="_blank"
                  rel="noreferrer nofollow"
                >
                  Open in new tab
                </a>
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>
    </div>
  );
};
