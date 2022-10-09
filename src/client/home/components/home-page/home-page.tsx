import 'reflect-metadata';
import { CompareProductsForm } from '@client/product';
import {
  Feed,
  FeedItem,
  FeedItems,
  FeedLink,
  FeedLinks,
  FeedTitle,
} from '@client/shared/components';
import { WebsiteLayout } from '@client/shared/layouts';
import { classNames } from '@client/shared/ui';
import { NextPageContext } from 'next';
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
        <FeedTitle>NVIDIA vs AMD</FeedTitle>

        <FeedItems>
          <FeedItem />
          <FeedItem />
          <FeedItem />
        </FeedItems>

        <FeedLinks>
          <FeedLink>All GPUs</FeedLink>
          <FeedLink>NVIDIA GPUs</FeedLink>
          <FeedLink>AMD GPUs</FeedLink>
        </FeedLinks>
      </Feed>

      <Feed className="my-4">
        <FeedTitle>NVIDIA GPUs</FeedTitle>

        <FeedItems>
          <FeedItem />
          <FeedItem />
          <FeedItem />
        </FeedItems>

        <FeedLinks>
          <FeedLink>All GPUs</FeedLink>
          <FeedLink>NVIDIA GPUs</FeedLink>
          <FeedLink>AMD GPUs</FeedLink>
        </FeedLinks>
      </Feed>

      <Feed className="my-4">
        <FeedTitle>AMD GPUs</FeedTitle>

        <FeedItems>
          <FeedItem />
          <FeedItem />
          <FeedItem />
        </FeedItems>

        <FeedLinks>
          <FeedLink>All GPUs</FeedLink>
          <FeedLink>NVIDIA GPUs</FeedLink>
          <FeedLink>AMD GPUs</FeedLink>
        </FeedLinks>
      </Feed>
    </WebsiteLayout>
  );
};

HomePage.getInitialProps = async (_ctx: NextPageContext) => {
  return {};
};

export default HomePage;
