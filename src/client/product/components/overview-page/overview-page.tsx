import { useProductCache } from '@client/shared/cache';
import {
  Breadcrumb,
  Breadcrumbs,
  Button,
  ButtonVariant,
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '@client/shared/components';
import { WebsiteLayout } from '@client/shared/layouts';
import { classNames } from '@client/shared/ui';
import {
  getProductDetailsPath,
  getProductName,
  Product,
  ProductsSort,
  RelatedProducts,
} from '@shared/product';
import { formatProductMeta } from '@shared/product-meta';
import { formatSpec } from '@shared/spec';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import {
  CompareProductsForm,
  CompareProductsFormLinks,
} from '../compare-products-form';

export interface ListQuery {
  company?: string;
  sort?: ProductsSort;
}

export interface OverviewGpusPageProps {
  listQuery: ListQuery;
  gpus: Product[];

  relatedProducts: RelatedProducts;
}

export const OverviewGpusPage = (props: OverviewGpusPageProps) => {
  const { listQuery, gpus, relatedProducts } = props;
  useProductCache(gpus);
  const router = useRouter();

  const title = 'Graphics Cards';
  const canonical = '/gpus';
  const keywords: string[] = [];

  const listTitle = '';
  const bestPerformanceUrl = '';
  const bestValueUrl = '';

  const handleGpuRowClick = useCallback(
    (url: string) => {
      router.push(url);
    },
    [router],
  );

  return (
    <WebsiteLayout seo={{ title, keywords, canonical }}>
      <Breadcrumbs className="mb-4">
        <Breadcrumb href="/">Home</Breadcrumb>
        <Breadcrumb>Graphics Cards</Breadcrumb>
      </Breadcrumbs>

      <section className="flex flex-col gap-8 justify-center">
        <section className={classNames('flex flex-col justify-center gap-4')}>
          <h2 className="md:text-2xl text-3xl mb-0">
            Compare GPU Specifications, Benchmarks, and Comparisons
          </h2>

          <CompareProductsForm values={[null, null]} />
          <CompareProductsFormLinks relatedProducts={relatedProducts} />
        </section>

        <article className="flex-1 flex flex-col">
          <header className="flex flex-1 gap-4 justify-between">
            <div>
              <h1 className="md:text-2xl text-3xl mb-0">
                Best GPUs by Performance
              </h1>
              <p className={classNames('text-content-dimmed')}>
                Sorted by highest performance benchmarks
              </p>
            </div>
            {/*<p className={classNames('text-content-dimmed')}>
              Sorted by performance benchmark per dollar
                      </p>*/}

            <div className="flex flex-1 gap-4 justify-end items-center">
              <Button
                href={`/gpus?sort=${ProductsSort.PerformanceRating}`}
                variant={ButtonVariant.Default}
              >
                Best Performing GPUs
              </Button>
              <Button
                href={`/gpus?sort=${ProductsSort.ValueRating}`}
                variant={ButtonVariant.Default}
              >
                Best Value GPUs
              </Button>
            </div>
          </header>

          <div className="flex">
            <Table responsive className="flex-1">
              <THead>
                <Tr>
                  <Th>GPU</Th>
                  <Th>Performance Rank</Th>
                  <Th>Value Rank</Th>
                  <Th>Release Date</Th>
                </Tr>
              </THead>

              <TBody>
                {gpus.map((gpu) => (
                  <Tr
                    key={gpu.id}
                    className="cursor-pointer"
                    onClick={() =>
                      handleGpuRowClick(getProductDetailsPath(gpu))
                    }
                  >
                    <Td>
                      <a href={getProductDetailsPath(gpu)}>
                        {getProductName(gpu)}
                      </a>
                    </Td>
                    <Td>
                      {formatProductMeta(gpu.metas.performanceRank) || '--'}
                    </Td>
                    <Td>{formatProductMeta(gpu.metas.valueRank) || '--'}</Td>
                    <Td>{formatSpec(gpu.specs.releaseDate) || '--'}</Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          </div>
        </article>
      </section>
    </WebsiteLayout>
  );
};
