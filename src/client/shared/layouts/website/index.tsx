import {
  ComputerDesktopIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid';
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
          <ComputerDesktopIcon className={classNames('h-8 w-8')} /> Finest PC
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
            'container px-8 py-3 text-content-primary max-w-100%',
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
