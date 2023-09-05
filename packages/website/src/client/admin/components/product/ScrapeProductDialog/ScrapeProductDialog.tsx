import { ProductDataSource, ProductType } from '@pcpartdb/shared';
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
  useState,
} from 'react';
import { ScrapedDataRow } from './ScrapedDataRow';
import {
  createScrapeContext,
  ScrapeProductContext,
} from './ScrapeProductContext';
import { ScrapedDataKey, ScrapedProduct } from './types';

interface ScrapeProductDialogProps {
  productType: ProductType;
  dataToScrape: ScrapedDataKey[];
  sources: Record<string, ProductDataSource>;
  onImport: (data: ScrapedProduct) => void;
}

export const ScrapeProductDialog: FunctionComponent<
  ScrapeProductDialogProps
> = (props) => {
  const { productType, dataToScrape, sources, onImport } = props;

  const [loading, setLoading] = useState<boolean>(true);
  const [context, setContext] = useState<ScrapedProduct>(null);

  useEffect(() => {
    async function scrapeProduct() {
      const response = await productService.scrapeProduct(productType, {
        sources,
      });
      setContext(createScrapeContext(productType, dataToScrape, response));
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
                  <Th>Value</Th>
                  <Th className="text-right">Import?</Th>
                </Tr>
              </THead>
              <TBody>
                {dataToScrape.map((field) => (
                  <ScrapedDataRow key={field} field={field} />
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
