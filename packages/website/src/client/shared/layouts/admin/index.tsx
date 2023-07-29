import {
  getAdminAutomationPath,
  getAdminListCpusPath,
  getAdminListGpusPath,
  getAdminListImagesPath,
  getAdminListUsersPath,
  getAdminOverviewPath,
  getAdminUpdatesPath,
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
  MetaReferrer,
  Seo,
  Toolbar,
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
      <Seo referrer={MetaReferrer.None} />
      <div className="container bg-content p-container flex font-bold items-center text-5xl md:text-3xl text-content">
        <Img
          src="/images/logo.svg"
          alt={`${WEBSITE_NAME} Logo`}
          className="w-10 mt-1 mr-4 md:w-8"
        />{' '}
        {WEBSITE_NAME}
      </div>

      <Toolbar>
        <Button variant={ButtonVariant.None} href={getHomePath()}>
          Back to Website
        </Button>
        <Button variant={ButtonVariant.None} onClick={handleLogout}>
          Sign Out
        </Button>
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
                variant={ButtonVariant.Generic}
                href={getAdminOverviewPath()}
              >
                Overview
              </Button>
              <Button
                variant={ButtonVariant.Generic}
                href={getAdminAutomationPath()}
              >
                Automation
              </Button>
              <Button
                variant={ButtonVariant.Generic}
                href={getAdminListCpusPath()}
              >
                CPUs
              </Button>
              <Button
                variant={ButtonVariant.Generic}
                href={getAdminListGpusPath()}
              >
                GPUs
              </Button>
              <Button
                variant={ButtonVariant.Generic}
                href={getAdminListImagesPath()}
              >
                Images
              </Button>
              <Button
                variant={ButtonVariant.Generic}
                href={getAdminListUsersPath()}
              >
                Users
              </Button>
              <Button
                variant={ButtonVariant.Generic}
                href={getAdminUpdatesPath()}
              >
                Data Updates
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
