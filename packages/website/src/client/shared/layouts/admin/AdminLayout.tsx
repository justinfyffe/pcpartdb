import { Bars3Icon } from '@heroicons/react/24/outline';
import {
  AutomationStatus,
  getAdminAutomationPath,
  getAdminListGamesPath,
  getAdminListImagesPath,
  getAdminListProductsPath,
  getAdminListUsersPath,
  getAdminOverviewPath,
  getHomePath,
  WEBSITE_NAME,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { authService } from '../../../auth/authService';
import { automationService } from '../../../automation/services/automationService';
import { Button, ButtonVariant } from '../../components/Button/Button';
import { Menu } from '../../components/Menu/Menu';
import { MenuLinkItem } from '../../components/Menu/MenuLinkItem';
import { MetaReferrer, Seo } from '../../components/Seo/Seo';
import { Toolbar } from '../../components/Toolbar/Toolbar';
import { classNames } from '../../ui/classNames';
import { AutomationStatusContext } from './AutomationStatusContext';

interface AdminLayoutProps {
  status?: AutomationStatus;
  className?: string;
  children?: React.ReactNode;
}

export const AdminLayout: FunctionComponent<AdminLayoutProps> = (props) => {
  const router = useRouter();

  // States & Memos

  const [automationStatus, setAutomationStatus] = useState<AutomationStatus>(
    props.status ?? null,
  );

  const pendingUpdates = useMemo(() => {
    return (
      (automationStatus?.pendingCpuSources ?? 0) +
      (automationStatus?.pendingGpuSources ?? 0) +
      (automationStatus?.pendingCpuUpdates ?? 0) +
      (automationStatus?.pendingGpuUpdates ?? 0)
    );
  }, [
    automationStatus?.pendingCpuSources,
    automationStatus?.pendingCpuUpdates,
    automationStatus?.pendingGpuSources,
    automationStatus?.pendingGpuUpdates,
  ]);

  // Callbacks

  const refreshAutomationStatus = useCallback(async () => {
    const status = await automationService.getStatus();
    setAutomationStatus({ ...status });
  }, []);

  const handleLogout = useCallback(async () => {
    await authService.logout();
    router.push(getHomePath());
  }, [router]);

  // Effects

  // Get automation status on load.
  useEffect(() => {
    if (automationStatus == null) {
      refreshAutomationStatus();
    }
  }, [automationStatus, refreshAutomationStatus]);

  // Render

  return (
    <AutomationStatusContext.Provider
      value={{
        status: automationStatus,
        refreshStatus: refreshAutomationStatus,
      }}
    >
      <Seo referrer={MetaReferrer.NoReferrer} />
      <div className="flex gap-4 border-x-px container bg-content p-container md:px-4 font-bold items-center text-6.5xl md:text-5xl text-main-brand">
        <img src="/images/logo-transparent.png" className="h-14 md:h-12" />
        <span className="font-san md:-mt-1">{WEBSITE_NAME.toUpperCase()}</span>
      </div>

      <Toolbar className="justify-between">
        <div className="flex">
          <Button variant={ButtonVariant.None} href={getHomePath()}>
            Back to Website
          </Button>
          <Button variant={ButtonVariant.None} onClick={handleLogout}>
            Sign Out
          </Button>
        </div>

        <Menu
          label={<Bars3Icon className="w-8" />}
          ariaLabel="Admin Menu"
          overlayClassName="w-62 max-h-125 overflow-x-hidden overflow-y-auto"
        >
          <MenuLinkItem href={getAdminOverviewPath()}>Overview</MenuLinkItem>
          <MenuLinkItem href={getAdminAutomationPath()}>
            Automation{pendingUpdates > 0 && <> ({pendingUpdates})</>}
          </MenuLinkItem>
          <MenuLinkItem href={getAdminListProductsPath()}>
            Products
          </MenuLinkItem>
          <MenuLinkItem href={getAdminListGamesPath()}>Games</MenuLinkItem>
          <MenuLinkItem href={getAdminListImagesPath()}>Images</MenuLinkItem>
          <MenuLinkItem href={getAdminListUsersPath()}>Users</MenuLinkItem>
        </Menu>
      </Toolbar>

      <div className="bg-html">
        <main
          className={classNames(
            'bg-content container flex gap-4 px-4 py-4 w-full',
            props.className,
          )}
        >
          <aside className="w-50 md:hidden">
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
                Automation{pendingUpdates > 0 && <> ({pendingUpdates})</>}
              </Button>
              <Button
                variant={ButtonVariant.Generic}
                href={getAdminListProductsPath()}
              >
                Products
              </Button>
              <Button
                variant={ButtonVariant.Generic}
                href={getAdminListGamesPath()}
              >
                Games
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
            </nav>
          </aside>
          <div className={classNames('flex-1 text-content', props.className)}>
            {props.children}
          </div>
        </main>
      </div>
    </AutomationStatusContext.Provider>
  );
};
