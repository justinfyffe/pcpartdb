import 'reflect-metadata';
import {
  CompareProductsForm,
  ComparisonFeedItem,
  Feed,
  FeedItems,
  FeedLink,
  FeedLinks,
  ProductFeedItem,
} from '@client/product';
import { WebsiteLayout } from '@client/shared/layouts';
import { classNames } from '@client/shared/ui';
import { Product } from '@shared/product';
import React from 'react';

export interface HomePageProps {
  nvidiaGpus: Product[];
  amdGpus: Product[];
}

export const HomePage = (props: HomePageProps) => {
  const { nvidiaGpus, amdGpus } = props;

  return (
    <WebsiteLayout>
      <section className={classNames('flex flex-col justify-center', 'mb-8')}>
        <h1 className="md:text-2xl text-3xl">
          GPU Specifications, Benchmarks, and Comparisons
        </h1>

        <CompareProductsForm values={[null, null]} className="mb-4" />

        <section className="flex flex-col gap-1 text-xs">
          <div className="flex gap-2">
            Popular Comparisons:
            <ul className="flex gap-3">
              <li>
                <a href="#">NVIDIA RTX 3090 vs NVIDIA RTX 3080</a>,
              </li>
              <li>
                <a href="#">NVIDIA RTX 3080 vs NVIDIA RTX 3070</a>
              </li>
            </ul>
          </div>
          <div className="flex gap-2">
            Popular GPUs:
            <ul className="flex gap-3">
              <li>
                <a href="#">NVIDIA RTX 3090</a>,
              </li>
              <li>
                <a href="#">NVIDIA RTX 3080</a>
              </li>
            </ul>
          </div>
        </section>
      </section>

      <Feed className="my-4">
        <h2>NVIDIA vs AMD GPUs</h2>

        <FeedItems>
          <ComparisonFeedItem products={[nvidiaGpus[0], nvidiaGpus[1]]} />
          <ComparisonFeedItem products={[nvidiaGpus[0], nvidiaGpus[1]]} />
          <ComparisonFeedItem products={[nvidiaGpus[0], nvidiaGpus[1]]} />
        </FeedItems>

        <FeedLinks>
          <FeedLink>All GPUs</FeedLink>
          <FeedLink>Best Performing GPUs</FeedLink>
          <FeedLink>Best Value GPUs</FeedLink>
        </FeedLinks>
      </Feed>

      <Feed className="my-4">
        <h2>Popular NVIDIA GPUs</h2>

        <FeedItems>
          {nvidiaGpus.map((gpu, i) => (
            <ProductFeedItem key={i} product={gpu} />
          ))}
        </FeedItems>

        <FeedLinks>
          <FeedLink>All NVIDIA GPUs</FeedLink>
          <FeedLink>Best Performing NVIDIA GPUs</FeedLink>
          <FeedLink>Best Value NVIDIA GPUs</FeedLink>
        </FeedLinks>
      </Feed>

      <Feed className="my-4">
        <h2>Popular AMD GPUs</h2>

        <FeedItems>
          {amdGpus.map((gpu, i) => (
            <ProductFeedItem key={i} product={gpu} />
          ))}
        </FeedItems>

        <FeedLinks>
          <FeedLink>All AMD GPUs</FeedLink>
          <FeedLink>Best Performing AMD GPUs</FeedLink>
          <FeedLink>Best Value AMD GPUs</FeedLink>
        </FeedLinks>
      </Feed>
    </WebsiteLayout>
  );
};

export default HomePage;
