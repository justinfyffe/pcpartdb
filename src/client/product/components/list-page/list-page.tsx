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
import { NextPageContext } from 'next';
import React from 'react';
import { CompareProductsForm } from '../compare-products-form';

interface ListGpusPageProps {}

export const ListGpusPage = (_props: ListGpusPageProps) => {
  return (
    <WebsiteLayout>
      <Article className="flex flex-wrap gap-6 lg:gap-8 justify-center">
        <ArticleHeader className="flex flex-wrap w-full items-center justify-between gap-3 lg:gap-4">
          <Breadcrumbs className="mb-3">
            <Breadcrumb href="/">PC Parts DB</Breadcrumb>
            <Breadcrumb href="/gpus">GPUs</Breadcrumb>
            <Breadcrumb>List GPUS</Breadcrumb>
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
                    <Th>
                      <a href="#">GPU</a>
                    </Th>
                    <Th>
                      <a href="#">Performance Rank</a>
                    </Th>
                    <Th>
                      <a href="#">Value Rank</a>
                    </Th>
                    <Th>
                      <a href="#">Release Date</a>
                    </Th>
                  </Tr>
                </THead>

                <TBody>
                  <Tr className="cursor-pointer">
                    <Td>
                      <a href="#">NVIDIA RTX 3090 Ti</a>
                    </Td>
                    <Td>1</Td>
                    <Td>2</Td>
                    <Td>Q3 2022</Td>
                  </Tr>
                  <Tr className="cursor-pointer">
                    <Td>
                      <a href="#">NVIDIA RTX 3090</a>
                    </Td>
                    <Td>2</Td>
                    <Td>1</Td>
                    <Td>Q3 2022</Td>
                  </Tr>
                  <Tr className="cursor-pointer">
                    <Td>
                      <a href="#">NVIDIA RTX 3090 Ti</a>
                    </Td>
                    <Td>1</Td>
                    <Td>2</Td>
                    <Td>Q3 2022</Td>
                  </Tr>
                  <Tr className="cursor-pointer">
                    <Td>
                      <a href="#">NVIDIA RTX 3090</a>
                    </Td>
                    <Td>2</Td>
                    <Td>1</Td>
                    <Td>Q3 2022</Td>
                  </Tr>
                  <Tr className="cursor-pointer">
                    <Td>
                      <a href="#">NVIDIA RTX 3090 Ti</a>
                    </Td>
                    <Td>1</Td>
                    <Td>2</Td>
                    <Td>Q3 2022</Td>
                  </Tr>
                  <Tr className="cursor-pointer">
                    <Td>
                      <a href="#">NVIDIA RTX 3090</a>
                    </Td>
                    <Td>2</Td>
                    <Td>1</Td>
                    <Td>Q3 2022</Td>
                  </Tr>
                  <Tr className="cursor-pointer">
                    <Td>
                      <a href="#">NVIDIA RTX 3090 Ti</a>
                    </Td>
                    <Td>1</Td>
                    <Td>2</Td>
                    <Td>Q3 2022</Td>
                  </Tr>
                  <Tr className="cursor-pointer">
                    <Td>
                      <a href="#">NVIDIA RTX 3090</a>
                    </Td>
                    <Td>2</Td>
                    <Td>1</Td>
                    <Td>Q3 2022</Td>
                  </Tr>
                  <Tr className="cursor-pointer">
                    <Td>
                      <a href="#">NVIDIA RTX 3090 Ti</a>
                    </Td>
                    <Td>1</Td>
                    <Td>2</Td>
                    <Td>Q3 2022</Td>
                  </Tr>
                  <Tr className="cursor-pointer">
                    <Td>
                      <a href="#">NVIDIA RTX 3090</a>
                    </Td>
                    <Td>2</Td>
                    <Td>1</Td>
                    <Td>Q3 2022</Td>
                  </Tr>
                  <Tr className="cursor-pointer">
                    <Td>
                      <a href="#">NVIDIA RTX 3090 Ti</a>
                    </Td>
                    <Td>1</Td>
                    <Td>2</Td>
                    <Td>Q3 2022</Td>
                  </Tr>
                  <Tr className="cursor-pointer">
                    <Td>
                      <a href="#">NVIDIA RTX 3090</a>
                    </Td>
                    <Td>2</Td>
                    <Td>1</Td>
                    <Td>Q3 2022</Td>
                  </Tr>
                  <Tr className="cursor-pointer">
                    <Td>
                      <a href="#">NVIDIA RTX 3090 Ti</a>
                    </Td>
                    <Td>1</Td>
                    <Td>2</Td>
                    <Td>Q3 2022</Td>
                  </Tr>
                  <Tr className="cursor-pointer">
                    <Td>
                      <a href="#">NVIDIA RTX 3090</a>
                    </Td>
                    <Td>2</Td>
                    <Td>1</Td>
                    <Td>Q3 2022</Td>
                  </Tr>
                  <Tr className="cursor-pointer">
                    <Td>
                      <a href="#">NVIDIA RTX 3090 Ti</a>
                    </Td>
                    <Td>1</Td>
                    <Td>2</Td>
                    <Td>Q3 2022</Td>
                  </Tr>
                  <Tr className="cursor-pointer">
                    <Td>
                      <a href="#">NVIDIA RTX 3090</a>
                    </Td>
                    <Td>2</Td>
                    <Td>1</Td>
                    <Td>Q3 2022</Td>
                  </Tr>
                  <Tr className="cursor-pointer">
                    <Td>
                      <a href="#">NVIDIA RTX 3090 Ti</a>
                    </Td>
                    <Td>1</Td>
                    <Td>2</Td>
                    <Td>Q3 2022</Td>
                  </Tr>
                  <Tr className="cursor-pointer">
                    <Td>
                      <a href="#">NVIDIA RTX 3090</a>
                    </Td>
                    <Td>2</Td>
                    <Td>1</Td>
                    <Td>Q3 2022</Td>
                  </Tr>
                  <Tr className="cursor-pointer">
                    <Td>
                      <a href="#">NVIDIA RTX 3090 Ti</a>
                    </Td>
                    <Td>1</Td>
                    <Td>2</Td>
                    <Td>Q3 2022</Td>
                  </Tr>
                  <Tr className="cursor-pointer">
                    <Td>
                      <a href="#">NVIDIA RTX 3090</a>
                    </Td>
                    <Td>2</Td>
                    <Td>1</Td>
                    <Td>Q3 2022</Td>
                  </Tr>
                </TBody>
              </Table>
            </div>
          </section>
        </section>
      </Article>
    </WebsiteLayout>
  );
};

ListGpusPage.getInitialProps = async (_ctx: NextPageContext) => {
  return {};
};
