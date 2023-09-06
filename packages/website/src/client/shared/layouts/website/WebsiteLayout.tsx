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
import { Button, ButtonVariant } from '../../components/Button/Button';
import {
  Footer,
  FooterSection,
  FooterSectionTitle,
} from '../../components/Footer/Footer';
import { Img } from '../../components/Img/Img';
import { List, ListItem } from '../../components/List/List';
import { Toolbar } from '../../components/Toolbar/Toolbar';
import { classNames } from '../../ui/classNames';

interface EditThisPage {
  href: string;
  name: string;
}

interface WebsiteLayoutProps {
  config?: Config;
  editThisPage?: EditThisPage[];

  className?: string;
  children?: React.ReactNode;
}

export const WebsiteLayout: FunctionComponent<WebsiteLayoutProps> = (props) => {
  const { config, editThisPage } = props;

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

          <p>
            {WEBSITE_NAME} is a participant in the Amazon Services LLC
            Associates Program, an affiliate advertising program. We earn from
            qualifying purchases.
          </p>
        </FooterSection>

        <FooterSection className={classNames('flex-none text-center w-full')}>
          Copyright &copy; {WEBSITE_NAME}
        </FooterSection>

        {config?.isStaff && editThisPage != null && (
          <FooterSection
            className={classNames('flex flex-wrap justify-center gap-2')}
          >
            {editThisPage.map((page, i) => (
              <a
                key={i}
                href={page.href}
                className="text-light-shades underline"
              >
                Edit {page.name}
              </a>
            ))}
          </FooterSection>
        )}
      </Footer>
    </>
  );
};
