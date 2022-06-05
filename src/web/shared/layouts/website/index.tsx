import classNames from 'classnames';
import React, { FunctionComponent } from 'react';
import { Button, ButtonStyle } from '../../components/button';
import { Toolbar, ToolbarNav, ToolbarTitle } from '../../components/toolbar';

interface WebsiteLayoutProps {
  className?: string;
  children?: React.ReactNode;
}

export const WebsiteLayout: FunctionComponent<WebsiteLayoutProps> = (props) => {
  return (
    <>
      <Toolbar>
        <ToolbarTitle>Website Name</ToolbarTitle>

        <ToolbarNav>
          <Button href="#" style={ButtonStyle.Toolbar}>
            Graphics Cards
          </Button>
          <Button href="#" style={ButtonStyle.Toolbar}>
            Processors
          </Button>
          <Button href="#" style={ButtonStyle.Toolbar}>
            PC Builds
          </Button>
        </ToolbarNav>
      </Toolbar>

      <div className={classNames('container my-6', props.className)}>
        {props.children}
      </div>

      <footer></footer>
    </>
  );
};
