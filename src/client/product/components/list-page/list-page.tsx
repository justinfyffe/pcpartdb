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
import { Product } from '@shared/product';
import { formatProductMeta } from '@shared/product-meta';
import { formatSpec } from '@shared/spec';
import React from 'react';
import { CompareProductsForm } from '../compare-products-form';

export interface ListGpusPageProps {
  gpus: Product[];
}

export const ListGpusPage = (props: ListGpusPageProps) => {
  const { gpus } = props;

  return (
    <WebsiteLayout>
      <Breadcrumbs className="mb-4">
        <Breadcrumb href="/">Home</Breadcrumb>
        <Breadcrumb href="/gpus">GPUs</Breadcrumb>
        <Breadcrumb>All GPUS</Breadcrumb>
      </Breadcrumbs>

      <article className="flex flex-wrap gap-6 lg:gap-8 justify-center">
        <section className="flex flex-wrap w-full items-center justify-between gap-3 lg:gap-4">
          <h2>Compare GPU Specifications, Benchmarks, and Comparisons</h2>

          <CompareProductsForm values={[null, null]} />
        </section>

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
                          {formatSpec(gpu.specs.company) || ''} {gpu.name}
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
          </section>
        </section>
      </article>
    </WebsiteLayout>
  );
};
