import 'reflect-metadata';
import {
  ApiError,
  getAdminListCpusPath,
  getAdminListGpusPath,
  Product,
  ProductDiff,
  ProductType,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import { ErrorAlert } from 'packages/website/src/client/shared/components/Alert/ErrorAlert';
import React, { useCallback, useMemo, useState } from 'react';
import { productService } from '../../../../product';
import {
  Button,
  ButtonVariant,
  Field,
  FieldHint,
  File,
  MetaRobots,
  Seo,
  Spinner,
} from '../../../../shared/components';
import { AdminLayout } from '../../../../shared/layouts';
import { ImportProductsTable } from './components';
import { ImportProductsPageContext } from './context';
import { useImportProductsPageContextProps } from './hooks';

interface AdminImportProductsPageProps {
  productType: ProductType;
}

export const AdminImportProductsPage = (
  props: AdminImportProductsPageProps,
) => {
  const { productType } = props;

  const [newDiffs, setNewDiffs] = useState<ProductDiff[]>([]);
  const [existingDiffs, setExistingDiffs] = useState<ProductDiff[]>([]);
  const [productsToImport, setProductsToImport] = useState(
    {} as Record<string, Product>,
  );

  const router = useRouter();
  const [importing, setImporting] = useState(false);
  const [requestError, setRequestError] = useState<ApiError>(null);

  const hasData = newDiffs.length > 0 || existingDiffs.length > 0;
  const productsToImportList = useMemo(
    () => Object.values(productsToImport).filter((value) => value != null),
    [productsToImport],
  );

  const { adminListHref, productTypeName } = useMemo(() => {
    if (productType === ProductType.Cpu) {
      return {
        adminListHref: getAdminListCpusPath(),
        productTypeName: 'CPUs',
      };
    } else if (productType === ProductType.Gpu) {
      return {
        adminListHref: getAdminListGpusPath(),
        productTypeName: 'GPUs',
      };
    } else {
      throw new Error(
        `Missing import support for product type = ${productType}`,
      );
    }
  }, [productType]);

  const handleFileChange = useCallback(
    async (file: File) => {
      const results = await productService.previewImportProducts(productType, {
        file,
      });

      const newDiffs = results.diffs.filter((value) => value.original == null);
      const existingDiffs = results.diffs.filter(
        (value) => value.original != null,
      );

      setNewDiffs(newDiffs);
      setExistingDiffs(existingDiffs);

      setProductsToImport(
        [...newDiffs].reduce((acc, diff) => {
          acc[diff.updated.slug] = diff.updated;
          return acc;
        }, {} as Record<string, Product>),
      );
    },
    [productType],
  );

  const handleImportSelection = useCallback(
    (diff: ProductDiff, checked: boolean) => {
      const product = diff.updated;
      if (checked) {
        productsToImport[product.slug] = product;
        setProductsToImport({ ...productsToImport });
      } else {
        delete productsToImport[product.slug];
        setProductsToImport({ ...productsToImport });
      }
    },
    [productsToImport],
  );

  const handleImportClicked = useCallback(async () => {
    setImporting(true);

    try {
      await productService.importProducts(productType, {
        products: productsToImportList,
      });

      router.push(adminListHref);
    } catch (err) {
      console.error(err);
      setRequestError(err as ApiError);
    } finally {
      setImporting(false);
    }
  }, [adminListHref, productType, productsToImportList, router]);

  const pageTitle = `Import ${productTypeName}`;
  const seoTitle = `${pageTitle} - Admin Panel`;
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  const context = useImportProductsPageContextProps({
    productsToImport,
    onImportSelection: handleImportSelection,
  });

  return (
    <ImportProductsPageContext.Provider value={context}>
      <AdminLayout>
        <Seo title={seoTitle} robots={seoRobots} />

        <article>
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-semibold">{pageTitle}</h1>

            <Button
              href={getAdminListGpusPath()}
              variant={ButtonVariant.Generic}
            >
              Back
            </Button>
          </div>

          {requestError && (
            <ErrorAlert>
              An unknown error has occurred. Please try again later.
            </ErrorAlert>
          )}

          <Field className="flex-1 mx-2">
            File
            <File name="file" onChange={handleFileChange} />
            <FieldHint className="flex justify-between">
              Upload results from scraping tool
            </FieldHint>
          </Field>

          {hasData && (
            <div className="flex flex-col mt-4 gap-4">
              <h2 className="mb-0">Preview</h2>

              <div className="flex gap-4">
                <section className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="mb-0">New {productTypeName}</h3>
                    <span>
                      {newDiffs.length} {productTypeName}
                    </span>
                  </div>

                  <ImportProductsTable
                    productType={productType}
                    diffs={newDiffs}
                  />
                </section>

                <section className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="mb-0">Existing {productTypeName}</h3>
                    <span>
                      {existingDiffs.length} {productTypeName}
                    </span>
                  </div>

                  <ImportProductsTable
                    productType={productType}
                    diffs={existingDiffs}
                  />
                </section>
              </div>

              <Button
                variant={ButtonVariant.Primary}
                disabled={importing || productsToImportList.length === 0}
                className="self-end"
                onClick={handleImportClicked}
              >
                {importing && <Spinner />}
                {!importing && (
                  <span>Import {productsToImportList.length} GPUs</span>
                )}
              </Button>
            </div>
          )}
        </article>
      </AdminLayout>
    </ImportProductsPageContext.Provider>
  );
};
