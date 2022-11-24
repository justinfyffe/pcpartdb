import 'reflect-metadata';
import {
  CompareProductsForm,
  ComparisonFeedItem,
  Feed,
  FeedItems,
  FeedLink,
  FeedLinks,
  FeedTitle,
  ProductFeedItem,
} from '@client/product';
import { WebsiteLayout } from '@client/shared/layouts';
import { classNames } from '@client/shared/ui';
import React from 'react';

interface HomePageProps {}

export const HomePage = (_props: HomePageProps) => {
  return (
    <WebsiteLayout>
      <section className={classNames('flex flex-col justify-center mt-2 mb-8')}>
        <h1 className={classNames('mb-8')}>
          GPU Specifications, Benchmarks, and Comparisons
        </h1>

        <section className="mb-2">
          <CompareProductsForm values={[null, null]} />
        </section>

        <section className="flex flex-col gap-1 text-sm">
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
        <FeedTitle>NVIDIA vs AMD GPUs</FeedTitle>

        <FeedItems>
          <ComparisonFeedItem />
          <ComparisonFeedItem />
          <ComparisonFeedItem />
        </FeedItems>

        <FeedLinks>
          <FeedLink>All GPUs</FeedLink>
          <FeedLink>Best Performing GPUs</FeedLink>
          <FeedLink>Best Value GPUs</FeedLink>
        </FeedLinks>
      </Feed>

      <Feed className="my-4">
        <FeedTitle>Popular NVIDIA GPUs</FeedTitle>

        <FeedItems>
          <ProductFeedItem />
          <ProductFeedItem />
          <ProductFeedItem />
        </FeedItems>

        <FeedLinks>
          <FeedLink>All NVIDIA GPUs</FeedLink>
          <FeedLink>Best Performing NVIDIA GPUs</FeedLink>
          <FeedLink>Best Value NVIDIA GPUs</FeedLink>
        </FeedLinks>
      </Feed>

      <Feed className="my-4">
        <FeedTitle>Popular AMD GPUs</FeedTitle>

        <FeedItems>
          <ProductFeedItem />
          <ProductFeedItem />
          <ProductFeedItem />
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
