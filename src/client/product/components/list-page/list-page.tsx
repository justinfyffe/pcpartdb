import {
  Article,
  ArticleHeader,
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
import { getProductMetaMap, getSpecMap, Product } from '@shared/product';
import { formatProductMeta } from '@shared/product-meta';
import { formatSpec } from '@shared/spec';
import React, { useMemo } from 'react';
import { CompareProductsForm } from '../compare-products-form';

export interface ListGpusPageProps {
  gpus: Product[];
}

export const ListGpusPage = (props: ListGpusPageProps) => {
  const { gpus } = props;

  const specs = useMemo(() => gpus.map((gpu) => getSpecMap(gpu)), [gpus]);
  const meta = useMemo(() => gpus.map((gpu) => getProductMetaMap(gpu)), [gpus]);

  return (
    <WebsiteLayout>
      <Article className="flex flex-wrap gap-6 lg:gap-8 justify-center">
        <ArticleHeader className="flex flex-wrap w-full items-center justify-between gap-3 lg:gap-4">
          <Breadcrumbs className="mb-3">
            <Breadcrumb href="/">Home</Breadcrumb>
            <Breadcrumb href="/gpus">GPUs</Breadcrumb>
            <Breadcrumb>All GPUS</Breadcrumb>
          </Breadcrumbs>

          <h2>Compare GPU Specifications, Benchmarks, and Comparisons</h2>

          <CompareProductsForm values={[null, null]} />
        </ArticleHeader>

        <section className="flex-1 flex flex-col gap-6">
          <section>
            <h1 className="mb-6">All GPUs</h1>

            <div className="flex">
              <aside className="w-200px"></aside>

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
                    <Tr key={i} className="cursor-pointer">
                      <Td>
                        <a href={`/gpus/view/${gpu.slug}`}>
                          {formatSpec(specs[i].COMPANY) || ''} {gpu.name}
                        </a>
                      </Td>
                      <Td>
                        {formatProductMeta(meta[i].PERFORMANCE_RANK) || '--'}
                      </Td>
                      <Td>{formatProductMeta(meta[i].VALUE_RANK) || '--'}</Td>
                      <Td>{formatSpec(specs[i].RELEASE_DATE) || '--'}</Td>
                    </Tr>
                  ))}
                </TBody>
              </Table>
            </div>
          </section>
        </section>
      </Article>
    </WebsiteLayout>
  );
};
