import {
  getAdminListGpusPath,
  getAdminListImagesPath,
  getAdminListUsersPath,
  getAdminOverviewPath,
  getAdminPendingUpdatesPath,
  getHomePath,
  WEBSITE_NAME,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import React, { FunctionComponent, useCallback } from 'react';
import { authService } from '../../../auth';
import {
  Button,
  ButtonVariant,
  Img,
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
    router.push(getHomePath());
  }, [router]);

  return (
    <>
      <Toolbar>
        <ToolbarTitle>
          <Img src="/images/logo.svg" className="w-8 mt-0.5 mr-1" />{' '}
          {WEBSITE_NAME}
        </ToolbarTitle>

        <ToolbarNav className="hidden md:block">
          <Button variant={ButtonVariant.Toolbar} href={getHomePath()}>
            Back to Website
          </Button>
          <Button variant={ButtonVariant.Toolbar} onClick={handleLogout}>
            Sign Out
          </Button>
        </ToolbarNav>
      </Toolbar>

      <div className="bg-html">
        <main
          className={classNames(
            'bg-content container flex gap-4 px-4 py-4 w-full',
            props.className,
          )}
        >
          <aside className="w-50">
            <nav className="flex flex-col gap-2">
              <Button
                variant={ButtonVariant.Default}
                href={getAdminOverviewPath()}
              >
                Overview
              </Button>
              <Button
                variant={ButtonVariant.Default}
                href={getAdminListGpusPath()}
              >
                GPUs
              </Button>
              <Button
                variant={ButtonVariant.Default}
                href={getAdminListImagesPath()}
              >
                Images
              </Button>
              <Button
                variant={ButtonVariant.Default}
                href={getAdminListUsersPath()}
              >
                Users
              </Button>
              <Button
                variant={ButtonVariant.Default}
                href={getAdminPendingUpdatesPath()}
              >
                Pending Updates
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
