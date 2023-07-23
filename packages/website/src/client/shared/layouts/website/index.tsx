import {
  Config,
  getAboutPath,
  getHomePath,
  getListCpusPath,
  getListGpusPath,
  getPrivacyPath,
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
  Toolbar,
} from '../../components';
import { classNames } from '../../ui';

interface WebsiteLayoutProps {
  config?: Config;
  editThisPageHref?: string;

  className?: string;
  children?: React.ReactNode;
}

export const WebsiteLayout: FunctionComponent<WebsiteLayoutProps> = (props) => {
  return (
    <>
      <div className="container bg-content p-container md:px-4 flex font-bold items-center text-5xl md:text-3xl text-dark-shades">
        <Img
          src="/images/logo.svg"
          alt={`${WEBSITE_NAME} Logo`}
          className="w-10 mt-1 mr-4 md:w-8"
        />{' '}
        {WEBSITE_NAME}
      </div>

      <Toolbar>
        <Button href={getListGpusPath()} variant={ButtonVariant.None}>
          Graphics Cards
        </Button>
        <Button href={getListCpusPath()} variant={ButtonVariant.None}>
          Processors
        </Button>
      </Toolbar>

      <div className="bg-html">
        <main
          className={classNames(
            'bg-content container p-container md:px-4 text-base text-content w-full',
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
              <a href={getHomePath()} className="text-light-shades underline">
                Home
              </a>
            </ListItem>
            <ListItem>
              <a href={getAboutPath()} className="text-light-shades underline">
                About Us
              </a>
            </ListItem>
            <ListItem>
              <a
                href={getPrivacyPath()}
                className="text-light-shades underline"
              >
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
            <a href={getAboutPath()} className="text-light-shades underline">
              contact us
            </a>
            .
          </p>

          {/* <p>
            {WEBSITE_NAME} is a participant of affiliate programs and earns
            commission from qualifying purchases.
          </p> */}
        </FooterSection>

        <FooterSection className={classNames('flex-none text-center w-full')}>
          Copyright &copy; {WEBSITE_NAME}
        </FooterSection>

        {props.config?.isStaff && props.editThisPageHref != null && (
          <FooterSection className={classNames('flex-none text-center w-full')}>
            <a
              href={props.editThisPageHref}
              className="text-light-shades underline"
            >
              edit this page
            </a>
          </FooterSection>
        )}
      </Footer>
    </>
  );
};
