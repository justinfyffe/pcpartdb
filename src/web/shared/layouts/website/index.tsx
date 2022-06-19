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

interface WebsiteLayoutProps {
  className?: string;
  children?: React.ReactNode;
}

export const WebsiteLayout: FunctionComponent<WebsiteLayoutProps> = (props) => {
  return (
    <>
      <Toolbar>
        <ToolbarTitle>
          <DesktopComputerIcon className={classNames('h-8 w-8')} /> Finest PC
        </ToolbarTitle>

        <ToolbarNav>
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
            <SearchIcon className="w-[20px]" />
          </Button>
        </ToolbarNav>
      </Toolbar>

      <main
        className={classNames(
          'container px-8 py-6 text-content-primary',
          props.className,
        )}
      >
        {props.children}
      </main>

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
              <a href="/contact" className="text-footer-link">
                Contact Us
              </a>
            </ListItem>
            <ListItem>
              <a href="/disclaimer" className="text-footer-link">
                Disclaimer
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
            Finest PC provides accurate specs and benchmarks based on various
            sources. If you discover an error, please contact us.
          </p>

          <p>
            Finest PC is a participant of affiliate programs and earns
            commission from qualifying purchases.
          </p>
        </FooterSection>

        <FooterSection className={classNames('flex-none text-center w-full')}>
          Copyright &copy; Finest PC
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
