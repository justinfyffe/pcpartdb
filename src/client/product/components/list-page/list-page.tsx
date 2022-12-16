import { useProductCache } from '@client/shared/cache';
import {
  Breadcrumb,
  Breadcrumbs,
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

export interface ListGpusPageProps {
  gpus: Product[];

  relatedProducts: RelatedProducts;
}

export const ListGpusPage = (props: ListGpusPageProps) => {
  const { gpus, relatedProducts } = props;
  useProductCache(gpus);
  const router = useRouter();

  const title = 'All GPUs';
  const canonical = '/gpus/list';

  const handleGpuRowClick = useCallback(
    (url: string) => {
      router.push(url);
    },
    [router],
  );

  return (
    <WebsiteLayout seo={{ title, canonical }}>
      <Breadcrumbs className="mb-4">
        <Breadcrumb href="/">Home</Breadcrumb>
        <Breadcrumb href="/gpus">GPUs</Breadcrumb>
        <Breadcrumb>{title}</Breadcrumb>
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
          <h1 className="md:text-2xl text-3xl">{title}</h1>

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
                {gpus.map((gpu, i) => (
                  <Tr
                    key={i}
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
