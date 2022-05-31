import 'reflect-metadata';
import { NextPageContext } from 'next';
import React from 'react';

interface HomePageProps {}

const HomePage = (_props: HomePageProps) => {
  return <h1 className="text-3xl font-bold underline">Hello World!</h1>;
};

HomePage.getInitialProps = async (_ctx: NextPageContext) => {
  return {};
};

export default HomePage;
