import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ComputerDesktopIcon, HeartIcon } from '@heroicons/react/24/solid';
import React, { FunctionComponent } from 'react';
import {
  Button,
  ButtonVariant,
  Footer,
  FooterSection,
  FooterSectionTitle,
  List,
  ListItem,
  Toolbar,
  ToolbarNav,
  ToolbarTitle,
} from '../../components';
import { classNames } from '../../ui';

interface WebsiteLayoutProps {
  className?: string;
  children?: React.ReactNode;
}

export const WebsiteLayout: FunctionComponent<WebsiteLayoutProps> = (props) => {
  return (
    <>
      <Toolbar>
        <ToolbarTitle>
          <ComputerDesktopIcon className={classNames('h-8 w-8 mt-[2px]')} /> PC
          Parts DB
        </ToolbarTitle>

        <ToolbarNav className="hidden md:block">
          <Button href="#" variant={ButtonVariant.Toolbar}>
            Graphics Cards
          </Button>
          <Button href="#" variant={ButtonVariant.Toolbar}>
            Processors
          </Button>
          <Button href="#" variant={ButtonVariant.Toolbar}>
            PC Builds
          </Button>

          <Button variant={ButtonVariant.Toolbar}>
            <MagnifyingGlassIcon className="w-[20px]" />
          </Button>
        </ToolbarNav>
      </Toolbar>

      <div className="bg-white">
        <main
          className={classNames(
            'container px-8 py-3 text-content max-w-100%',
            props.className,
          )}
        >
          {props.children}
        </main>
      </div>

      <Footer>
        <FooterSection as="nav">
          <FooterSectionTitle>Pages</FooterSectionTitle>

          <List direction="vertical">
            <ListItem>
              <a href="/" className="text-footer-link">
                Home
              </a>
            </ListItem>
            <ListItem>
              <a href="/about" className="text-footer-link">
                About Us
              </a>
            </ListItem>
            <ListItem>
              <a href="/privacy" className="text-footer-link">
                Privacy
              </a>
            </ListItem>
          </List>
        </FooterSection>

        <FooterSection>
          <FooterSectionTitle>Disclaimer &amp; Disclosure</FooterSectionTitle>

          <p>
            PC Parts DB provides specs, benchmarks, and reviews based on various
            sources. If you discover an error, please{' '}
            <a href="/about" className="text-footer-link">
              contact us
            </a>
            .
          </p>

          <p>
            PC Parts DB is a participant of affiliate programs and earns
            commission from qualifying purchases.
          </p>
        </FooterSection>

        <FooterSection className={classNames('flex-none text-center w-full')}>
          Copyright &copy; PC Parts DB
          <br />
          Made with{' '}
          <HeartIcon
            className={classNames('inline-block h-[16px] w-[16px] mb-[2px]')}
          />{' '}
          in New York
        </FooterSection>
      </Footer>
    </>
  );
};
