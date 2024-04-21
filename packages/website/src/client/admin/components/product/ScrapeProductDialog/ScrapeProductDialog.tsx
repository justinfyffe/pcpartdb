import { ProductSource, ProductType } from '@pcpartdb/shared';
import { productService } from 'packages/website/src/client/product/services/productService';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import { PrimaryButton } from 'packages/website/src/client/shared/components/Button/PrimaryButton';
import { closeDialog } from 'packages/website/src/client/shared/components/Dialog/dialog';
import { Spinner } from 'packages/website/src/client/shared/components/Spinner/Spinner';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BENCHMARKS_TO_SCRAPE, DATA_TO_SCRAPE } from './consts';
import { ScrapedBenchmarkRow } from './ScrapedBenchmarkRow';
import { ScrapedCompanyRow } from './ScrapedCompanyRow';
import { ScrapedFieldRow } from './ScrapedFieldRow';
import { ScrapedGameRow } from './ScrapedGameRow';
import { ScrapedNameRow } from './ScrapedNameRow';
import { ScrapedOtherNamesRow } from './ScrapedOtherNamesRow';
import { ScrapedSearchTextRow } from './ScrapedSearchTextRow';
import {
  createScrapeContext,
  ScrapeProductContext,
} from './ScrapeProductContext';
import { ScrapedProduct } from './types';

interface ScrapeProductDialogProps {
  productType: ProductType;
  sources: Partial<ProductSource>[];
  onImport: (data: ScrapedProduct) => void;
}

export const ScrapeProductDialog: FunctionComponent<
  ScrapeProductDialogProps
> = (props) => {
  const { productType, sources, onImport } = props;

  const fieldsToScrape = DATA_TO_SCRAPE[productType];
  const benchmarksToScrape = BENCHMARKS_TO_SCRAPE[productType];

  const [loading, setLoading] = useState<boolean>(true);
  const [context, setContext] = useState<ScrapedProduct>(null);

  useEffect(() => {
    async function scrapeProduct() {
      const response = await productService.scrape({
        productType,
        sources,
      });
      setContext(
        createScrapeContext(
          productType,
          fieldsToScrape ?? [],
          benchmarksToScrape ?? [],
          response,
        ),
      );
      setLoading(false);
    }
    scrapeProduct();
    // Should only run once on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApply = useCallback(() => {
    onImport(context);
    closeDialog();
  }, [onImport, context]);

  const handleCancel = useCallback(() => {
    closeDialog();
  }, []);

  return (
    <div className="bg-white flex flex-col gap-4 h-[80%] w-[80%] p-4 overflow-auto max-w-247 rounded shadow">
      {loading && (
        <div className="flex flex-col items-center justify-center h-full w-full gap-6">
          <Spinner className="w-24 h-24 border-3" />
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl text-center">Importing data.</h3>
            <div className="text-lg">This may take a moment.</div>
          </div>
        </div>
      )}

      {!loading && (
        <ScrapeProductContext.Provider value={context}>
          <div className="flex-1 max-h-[calc(100%_-_50px)] overflow-auto">
            <Table>
              <THead>
                <Tr sticky>
                  <Th>Field</Th>
                  <Th>Raw</Th>
                  <Th>Formatted</Th>
                  <Th className="text-right">Import?</Th>
                </Tr>
              </THead>
              <TBody>
                <ScrapedNameRow />
                <ScrapedCompanyRow />
                <ScrapedSearchTextRow />
                <ScrapedOtherNamesRow />
                {fieldsToScrape?.map((field) => (
                  <ScrapedFieldRow key={field} fieldKey={field} />
                ))}
                {benchmarksToScrape?.map((benchmarkKey) => (
                  <ScrapedBenchmarkRow
                    key={benchmarkKey}
                    benchmarkKey={benchmarkKey}
                  />
                ))}
                {Object.keys(context?.data?.games ?? {}).map((gameId) => (
                  <ScrapedGameRow key={gameId} gameId={gameId} />
                ))}
              </TBody>
            </Table>
          </div>
        </ScrapeProductContext.Provider>
      )}

      <div className="flex justify-between">
        <GenericButton onClick={handleCancel}>Cancel</GenericButton>
        <PrimaryButton onClick={handleApply}>Apply</PrimaryButton>
      </div>
    </div>
  );
};
