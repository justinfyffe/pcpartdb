import 'reflect-metadata';
import { NextPageContext } from 'next';
import React from 'react';
import { Button, ButtonStyle } from '../web/shared/ui/button';
import { Toolbar, ToolbarNav, ToolbarTitle } from '../web/shared/ui/toolbar';

interface HomePageProps {}

const HomePage = (_props: HomePageProps) => {
  return (
    <Toolbar>
      <ToolbarTitle>Website Name</ToolbarTitle>

      <ToolbarNav>
        <Button href="#" style={ButtonStyle.Toolbar}>
          Home
        </Button>
        <Button href="#" style={ButtonStyle.Toolbar}>
          Processors
        </Button>
        <Button href="#" style={ButtonStyle.Toolbar}>
          Graphics Cards
        </Button>
        <Button href="#" style={ButtonStyle.Toolbar}>
          PC Builds
        </Button>
      </ToolbarNav>
    </Toolbar>
  );
};

HomePage.getInitialProps = async (_ctx: NextPageContext) => {
  return {};
};

export default HomePage;
