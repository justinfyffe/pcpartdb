import { authService } from '@client/auth';
import { SeoInputs, WEBSITE_NAME } from '@shared/website';
import { useRouter } from 'next/router';
import React, { FunctionComponent, useCallback } from 'react';
import {
  Button,
  ButtonVariant,
  Img,
  Seo,
  Toolbar,
  ToolbarNav,
  ToolbarTitle,
} from '../../components';
import { classNames } from '../../ui';

interface AdminLayoutProps {
  seo?: SeoInputs;

  className?: string;
  children?: React.ReactNode;
}

export const AdminLayout: FunctionComponent<AdminLayoutProps> = (props) => {
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    await authService.logout();
    router.push('/');
  }, [router]);

  return (
    <>
      <Seo seo={props.seo || {}} />
      <Toolbar>
        <ToolbarTitle>
          <Img src="/images/logo.svg" className="w-8 mt-0.5 mr-1" />{' '}
          {WEBSITE_NAME}
        </ToolbarTitle>

        <ToolbarNav className="hidden md:block">
          <Button variant={ButtonVariant.Toolbar} href="/">
            Back to Website
          </Button>
          <Button variant={ButtonVariant.Toolbar} onClick={handleLogout}>
            Sign Out
          </Button>
        </ToolbarNav>
      </Toolbar>

      <div className="bg-white">
        <main
          className={classNames(
            'container flex gap-4 px-4 py-4 max-w-full w-full',
            props.className,
          )}
        >
          <aside className="w-50">
            <nav className="flex flex-col gap-2">
              <Button variant={ButtonVariant.Default} href="/admin">
                Overview
              </Button>
              <Button variant={ButtonVariant.Default} href="/admin/gpus">
                GPUs
              </Button>
              <Button variant={ButtonVariant.Default} href="/admin/images">
                Images
              </Button>
              <Button variant={ButtonVariant.Default} href="/admin/users">
                Accounts
              </Button>
              <Button variant={ButtonVariant.Default} href="/admin/export">
                Export
              </Button>
            </nav>
          </aside>
          <div className={classNames('flex-1 text-content', props.className)}>
            {props.children}
          </div>
        </main>
      </div>
    </>
  );
};
