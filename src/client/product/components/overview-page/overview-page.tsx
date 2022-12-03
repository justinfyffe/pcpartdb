import { Breadcrumb, Breadcrumbs, Card } from '@client/shared/components';
import { WebsiteLayout } from '@client/shared/layouts';
import { classNames } from '@client/shared/ui';
import { Product, ProductsOrderBy } from '@shared/product';
import React from 'react';
import { CompareProductsForm } from '../compare-products-form';
import { Feed, FeedItems, FeedLink, FeedLinks } from '../feed';

export interface OverviewGpusPageProps {
  gpusByPerformance: Product[];
  gpusByValue: Product[];
}

export const OverviewGpusPage = (_props: OverviewGpusPageProps) => {
  return (
    <WebsiteLayout>
      <Breadcrumbs className="mb-4">
        <Breadcrumb href="/">Home</Breadcrumb>
        <Breadcrumb>GPUs</Breadcrumb>
      </Breadcrumbs>

      <article className="flex flex-wrap gap-6 lg:gap-8 justify-center">
        <section className="flex flex-wrap w-full items-center justify-between gap-3 lg:gap-4">
          <h2>Compare GPU Specifications, Benchmarks, and Comparisons</h2>

          <CompareProductsForm values={[null, null]} />
        </section>

        <section
          className={classNames(
            'grid grid-cols-2 grid-rows-[auto_auto] gap-6 mb-8 w-full',
          )}
        >
          <Card>
            <h2
              className={classNames('font-medium mb-3 text-2xl text-slate-700')}
            >
              Best Gaming GPUs by Performance
            </h2>

            <p className={classNames('text-gray-400 mb-4')}>
              Sorted by highest performance benchmarks
            </p>

            <ul className={classNames('flex flex-col gap-6 mb-4')}>
              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #1
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 3700
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
                  )}
                >
                  100.0
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #2
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 3600
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
                  )}
                >
                  93.34
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #3
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 2800
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
                  )}
                >
                  92.23
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #4
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 2700
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
                  )}
                >
                  82.23
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #5
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 2600
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
                  )}
                >
                  81.23
                </div>
              </li>
            </ul>

            <div className={classNames('self-end')}>
              <a
                href={`/gpus/list?sort=${ProductsOrderBy.PerformanceRating}`}
                className={classNames('text-indigo-400')}
              >
                View all GPUs by performance
              </a>
            </div>
          </Card>

          <Card>
            <h2
              className={classNames('font-medium mb-3 text-2xl text-slate-700')}
            >
              Best Gaming GPUs by Value
            </h2>

            <p className={classNames('text-gray-400 mb-4')}>
              Sorted by performance benchmark per dollar
            </p>

            <ul className={classNames('flex flex-col gap-6 mb-4')}>
              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #1
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 3700
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
                  )}
                >
                  100.0
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #2
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 3600
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
                  )}
                >
                  93.34
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #3
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 2800
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
                  )}
                >
                  92.23
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #4
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 2700
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
                  )}
                >
                  82.23
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #5
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 2600
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
                  )}
                >
                  81.23
                </div>
              </li>
            </ul>

            <div className={classNames('self-end')}>
              <a
                href={`/gpus/list?sort=${ProductsOrderBy.ValueRating}`}
                className={classNames('text-indigo-400')}
              >
                View all GPUs by performance per dollar
              </a>
            </div>
          </Card>
        </section>

        <Feed>
          <h2>Popular Comparisons</h2>

          <FeedItems></FeedItems>
        </Feed>

        <Feed>
          <h2>Popular GPUs</h2>

          <FeedItems></FeedItems>

          <FeedLinks>
            <FeedLink>All GPUs</FeedLink>
            <FeedLink>Best Performing GPUs</FeedLink>
            <FeedLink>Best Value GPUs</FeedLink>
          </FeedLinks>
        </Feed>
      </article>
    </WebsiteLayout>
  );
};
