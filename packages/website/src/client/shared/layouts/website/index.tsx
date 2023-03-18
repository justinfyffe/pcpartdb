import { HeartIcon } from '@heroicons/react/24/solid';
import {
  getAboutPath,
  getHomePath,
  getListGpusPath,
  getPrivacyPath,
  SeoInputs,
  WEBSITE_NAME,
} from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import {
  Button,
  ButtonVariant,
  Footer,
  FooterSection,
  FooterSectionTitle,
  Img,
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
          <Img src="/images/logo.svg" className="w-8 mt-0.5 mr-1" />{' '}
          {WEBSITE_NAME}
        </ToolbarTitle>

        <ToolbarNav>
          <Button href={getListGpusPath()} variant={ButtonVariant.Toolbar}>
            GPUs
          </Button>
        </ToolbarNav>
      </Toolbar>

      <div className="bg-html">
        <main
          className={classNames(
            'bg-content container px-4 py-4 text-content w-full',
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
              <a href={getHomePath()} className="text-footer-link">
                Home
              </a>
            </ListItem>
            <ListItem>
              <a href={getAboutPath()} className="text-footer-link">
                About Us
              </a>
            </ListItem>
            <ListItem>
              <a href={getPrivacyPath()} className="text-footer-link">
                Privacy
              </a>
            </ListItem>
          </List>
        </FooterSection>

        <FooterSection>
          <FooterSectionTitle>Disclaimer &amp; Disclosure</FooterSectionTitle>

          <p>
            {WEBSITE_NAME} provides specs and benchmarks based on various
            sources. If you discover an error, please{' '}
            <a href={getAboutPath()} className="text-footer-link">
              contact us
            </a>
            .
          </p>

          <p>
            {WEBSITE_NAME} is a participant of affiliate programs and earns
            commission from qualifying purchases.
          </p>
        </FooterSection>

        <FooterSection className={classNames('flex-none text-center w-full')}>
          Copyright &copy; {WEBSITE_NAME}
          <br />
          Made with{' '}
          <HeartIcon className={classNames('inline-block h-4 w-4 mb-0.5')} /> in
          New York
        </FooterSection>
      </Footer>
    </>
  );
};
