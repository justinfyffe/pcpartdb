import { DesktopComputerIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import React, { FunctionComponent, useCallback } from 'react';
import { authService } from '../../../auth/auth.service';
import { Button, ButtonVariant } from '../../components/button';
import { Toolbar, ToolbarNav, ToolbarTitle } from '../../components/toolbar';
import { classNames } from '../../ui/ui.utils';

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
          <DesktopComputerIcon className={classNames('h-8 w-8')} /> Finest PC
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
            'container flex gap-8 px-8 py-6 text-content-primary max-w-100%',
            props.className,
          )}
        >
          <aside className="w-[200px]">
            <nav className="flex flex-col gap-2">
              <Button variant={ButtonVariant.Default} href="/admin">
                Overview
              </Button>
              <Button variant={ButtonVariant.Default} href="/admin/cpus">
                CPUs
              </Button>
              <Button variant={ButtonVariant.Default} href="/admin/gpus">
                GPUs
              </Button>
              <Button variant={ButtonVariant.Default} href="/admin/images">
                Images
              </Button>
              <Button variant={ButtonVariant.Default} href="/admin/users">
                Users
              </Button>
            </nav>
          </aside>
          {props.children}
        </main>
      </div>
    </>
  );
};
