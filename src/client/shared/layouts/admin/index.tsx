import { authService } from '@client/auth';
import { ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import React, { FunctionComponent, useCallback } from 'react';
import {
  Button,
  ButtonVariant,
  Toolbar,
  ToolbarNav,
  ToolbarTitle,
} from '../../components';
import { classNames } from '../../ui';

interface AdminLayoutProps {
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
      <Toolbar>
        <ToolbarTitle>
          <ComputerDesktopIcon className={classNames('h-8 w-8')} /> PC Parts DB
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
            'container flex gap-8 px-8 py-6 text-content max-w-100%',
            props.className,
          )}
        >
          <aside className="w-[200px]">
            <nav className="flex flex-col gap-2">
              <Button variant={ButtonVariant.Default} href="/admin">
                Overview
              </Button>
              <Button variant={ButtonVariant.Default} href="/admin/gpus">
                GPUs
              </Button>
              <Button variant={ButtonVariant.Default} href="#">
                Comparisons
              </Button>
              <Button variant={ButtonVariant.Default} href="#">
                Articles
              </Button>
              <Button variant={ButtonVariant.Default} href="/admin/images">
                Images
              </Button>
              <Button variant={ButtonVariant.Default} href="/admin/users">
                Accounts
              </Button>
              <Button variant={ButtonVariant.Default} href="#">
                Monetization
              </Button>
              <Button variant={ButtonVariant.Default} href="#">
                SEO
              </Button>
              <Button variant={ButtonVariant.Default} href="#">
                Task Queue
              </Button>
            </nav>
          </aside>
          {props.children}
        </main>
      </div>
    </>
  );
};
