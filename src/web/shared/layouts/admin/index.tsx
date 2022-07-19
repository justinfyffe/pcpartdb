import { DesktopComputerIcon, SearchIcon } from '@heroicons/react/outline';
import { HeartIcon } from '@heroicons/react/solid';
import React, { FunctionComponent } from 'react';
import { Button, ButtonVariant } from '../../components/button';
import {
  Footer,
  FooterSection,
  FooterSectionTitle,
} from '../../components/footer';
import { List, ListItem } from '../../components/list';
import { Toolbar, ToolbarNav, ToolbarTitle } from '../../components/toolbar';
import { classNames } from '../../ui/ui.utils';

interface AdminLayoutProps {
  className?: string;
  children?: React.ReactNode;
}

export const AdminLayout: FunctionComponent<AdminLayoutProps> = (props) => {
  return (
    <>
      <Toolbar>
        <ToolbarTitle>
          <DesktopComputerIcon className={classNames('h-8 w-8')} /> Finest PC
        </ToolbarTitle>

        <ToolbarNav className="hidden md:block">
          <Button href="#" variant={ButtonVariant.Toolbar}>
            Back to Website
          </Button>
          <Button href="#" variant={ButtonVariant.Toolbar}>
            Sign Out
          </Button>
        </ToolbarNav>
      </Toolbar>

      <div className="bg-white">
        <main
          className={classNames(
            'container px-8 py-6 text-content-primary max-w-100%',
            props.className,
          )}
        >
          {props.children}
        </main>
      </div>
    </>
  );
};
