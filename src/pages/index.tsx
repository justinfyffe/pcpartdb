import 'reflect-metadata';
import { NextPageContext } from 'next';
import React from 'react';

interface HomePageProps {}

const HomePage = (_props: HomePageProps) => {
  return <main id="home-page">Test</main>;
};

HomePage.getInitialProps = async (_ctx: NextPageContext) => {
  return {};
};

export default HomePage;
