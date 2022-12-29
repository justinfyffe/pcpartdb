import { ComputerDesktopIcon, HeartIcon } from '@heroicons/react/24/solid';
import { SeoInputs, WEBSITE_NAME } from '@shared/website';
import React, { FunctionComponent } from 'react';
import {
  Button,
  ButtonVariant,
  Footer,
  FooterSection,
  FooterSectionTitle,
  List,
  ListItem,
  Seo,
  Toolbar,
  ToolbarNav,
  ToolbarTitle,
} from '../../components';
import { classNames } from '../../ui';

interface WebsiteLayoutProps {
  seo?: SeoInputs;

  className?: string;
  children?: React.ReactNode;
}

export const WebsiteLayout: FunctionComponent<WebsiteLayoutProps> = (props) => {
  return (
    <>
      <Seo seo={props.seo ?? {}} />
      <Toolbar>
        <ToolbarTitle>
          <ComputerDesktopIcon className={classNames('h-8 w-8 mt-0.5')} />{' '}
          {WEBSITE_NAME}
        </ToolbarTitle>

        <ToolbarNav>
          <Button href="/gpus" variant={ButtonVariant.Toolbar}>
            GPUs
          </Button>
        </ToolbarNav>
      </Toolbar>

      <div className="bg-white">
        <main
          className={classNames(
            'container px-4 py-4 text-content max-w-full w-full',
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
          <HeartIcon className={classNames('inline-block h-4 w-4 mb-0.5')} /> in
          New York
        </FooterSection>
      </Footer>
    </>
  );
};
