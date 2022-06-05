import 'reflect-metadata';
import classNames from 'classnames';
import { NextPageContext } from 'next';
import React from 'react';
import { Jumbotron } from '../web/shared/components/jumbotron';
import { WebsiteLayout } from '../web/shared/layouts/website';

interface HomePageProps {}

const HomePage = (_props: HomePageProps) => {
  return (
    <WebsiteLayout>
      <main>
        <section
          className={classNames(
            'grid grid-cols-1 sm:grid-cols-[1fr_300px] grid-rows-2 sm:grid-rows-1 gap-6',
          )}
        >
          <Jumbotron className={classNames()}>Main</Jumbotron>
          <aside className={classNames()}>Side</aside>
        </section>
      </main>
    </WebsiteLayout>
  );
};

HomePage.getInitialProps = async (_ctx: NextPageContext) => {
  return {};
};

export default HomePage;
