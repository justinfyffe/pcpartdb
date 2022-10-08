import 'reflect-metadata';
import { ChipIcon, DesktopComputerIcon } from '@heroicons/react/outline';
import { NextPageContext } from 'next';
import React from 'react';
import { CompareForm } from '../../client/compare';
import { Card } from '../../client/shared/components/card';
import {
  Feed,
  FeedItem,
  FeedItems,
  FeedLink,
  FeedLinks,
  FeedTitle,
} from '../../client/shared/components/feed';
import { Img } from '../../client/shared/components/image';
import { SectionHeader } from '../../client/shared/components/section-header';
import { WebsiteLayout } from '../../client/shared/layouts/website';
import { classNames } from '../../client/shared/ui/ui.utils';

interface HomePageProps {}

export const HomePage = (_props: HomePageProps) => {
  return (
    <WebsiteLayout>
      <section
        className={classNames(
          'grid grid-cols-1 sm:grid-cols-[1fr_300px] grid-rows-2 sm:grid-rows-1 gap-6',
        )}
      >
        <Card className={classNames('gap-4 flex flex-col justify-center')}>
          <h1 className={classNames('mb-3')}>Compare GPUs</h1>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          <CompareForm values={[null, null]} />
        </Card>

        <aside className={classNames()}>
          <Card
            className={classNames(
              'items-start flex flex-col flex-wrap gap-2 h-full justify-center',
            )}
          >
            <SectionHeader
              center
              lines={false}
              className={classNames('mb-0 text-slate-700')}
            >
              Featured Builds: June
            </SectionHeader>

            {/* TODO: make this into a slideshow of builds */}
            <div
              className={classNames(
                'flex flex-col flex-1 justify-center w-full',
              )}
            >
              <a href="#">
                <h2
                  className={classNames(
                    'font-medium mb-2 text-center text-indigo-500',
                  )}
                >
                  Elite AMD Gaming Build
                </h2>
                <Img
                  src="https://preview.redd.it/8siyqldph2x21.jpg?auto=webp&s=eeaa2cdf9c4e01746f4f46cc08c66e5eff77c630"
                  className={classNames(
                    'h-auto w-auto max-h-32 max-w-full mx-auto mb-2 object-cover',
                  )}
                  width="360"
                  height="200"
                />
              </a>

              <div className={classNames('text-center text-sm font-medium')}>
                $2,389
                <ChipIcon className={classNames('inline-block h-4 w-4 mx-2')} />
                <a
                  href="#"
                  className={classNames('font-normal text-indigo-500')}
                >
                  View Parts
                </a>
              </div>
            </div>

            <footer className={classNames('self-center')}>
              <div className={classNames('text-xs text-center')}>
                Check out more{' '}
                <a href="#" className={classNames('text-indigo-500')}>
                  PC builds
                </a>
              </div>
            </footer>
          </Card>
        </aside>
      </section>

      <Feed className="my-4">
        <FeedTitle icon={DesktopComputerIcon}>Which GPU is Better?</FeedTitle>

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
        <FeedTitle icon={DesktopComputerIcon}>Which CPU is Better?</FeedTitle>

        <FeedItems>
          <FeedItem />
          <FeedItem />
          <FeedItem />
        </FeedItems>

        <FeedLinks>
          <FeedLink>All CPUs</FeedLink>
          <FeedLink>Intel CPUs</FeedLink>
          <FeedLink>AMD CPUs</FeedLink>
        </FeedLinks>
      </Feed>

      <Feed className="my-4">
        <FeedTitle icon={DesktopComputerIcon}>PC Builds</FeedTitle>

        <FeedItems>
          <FeedItem />
          <FeedItem />
          <FeedItem />
        </FeedItems>

        <FeedLinks>
          <FeedLink>All PC Builds</FeedLink>
          <FeedLink>Gaming PC Builds</FeedLink>
          <FeedLink>Crypto Mining PC Builds</FeedLink>
          <FeedLink>Office PC Builds</FeedLink>
        </FeedLinks>
      </Feed>
    </WebsiteLayout>
  );
};

HomePage.getInitialProps = async (_ctx: NextPageContext) => {
  return {};
};

export default HomePage;
