import { HeartIcon } from '@heroicons/react/solid';
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

      <div className={classNames('container my-6 px-4', props.className)}>
        {props.children}
      </div>

      <footer className={classNames('bg-indigo-900')}>
        <div
          className={classNames(
            'container flex flex-wrap text-gray-50 text-sm',
          )}
        >
          <nav className={classNames('flex-1 m-4')}>
            <div className={classNames('border-b mb-3')}>Pages</div>

            <ul className={classNames('font-normal list-name m-0 p-0')}>
              <li className={classNames('my-1')}>
                <a href="#" className={classNames('text-indigo-200')}>
                  Home
                </a>
              </li>
              <li className={classNames('my-1')}>
                <a href="#" className={classNames('text-indigo-200')}>
                  About Us
                </a>
              </li>
              <li className={classNames('my-1')}>
                <a href="#" className={classNames('text-indigo-200')}>
                  Contact Us
                </a>
              </li>
              <li className={classNames('my-1')}>
                <a href="#" className={classNames('text-indigo-200')}>
                  Disclaimer
                </a>
              </li>
              <li className={classNames('my-1')}>
                <a href="#" className={classNames('text-indigo-200')}>
                  Privacy Policy
                </a>
              </li>
            </ul>
          </nav>

          <div className={classNames('flex-1 m-4')}>
            <div className={classNames('border-b mb-3')}>
              Disclaimer &amp; Disclosure
            </div>

            <p className={classNames('mb-3')}>
              Website Name provides accurate specs and benchmarks based on
              various sources. If you discover an error, please contact us.
            </p>

            <p className={classNames('mb-3')}>
              Website Name is a participant of affiliate programs and earns
              commission from qualifying purchases.
            </p>
          </div>

          <div className={classNames('mb-4 text-center w-full')}>
            Copyright &copy; Website Name {new Date().getFullYear()}
            <br />
            Made with{' '}
            <HeartIcon className={classNames('inline-block h-3 w-3 mb-1')} /> in
            New York
          </div>
        </div>
      </footer>
    </>
  );
};
