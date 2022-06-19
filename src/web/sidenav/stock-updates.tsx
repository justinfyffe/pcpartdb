import { InformationCircleIcon } from '@heroicons/react/outline';
import React, { FunctionComponent } from 'react';
import { Button, ButtonVariant } from '../shared/components/button';
import { Input } from '../shared/components/input';
import { classNames } from '../shared/ui/ui.utils';
import { SidenavSection, SidenavSectionTitle } from './sidenav';

interface SidenavStockUpdatesProps {}

export const SidenavStockUpdates: FunctionComponent<
  SidenavStockUpdatesProps
> = (_props) => {
  return (
    <SidenavSection className="flex flex-col gap-3">
      <SidenavSectionTitle>
        Notify me of stock updates{' '}
        <InformationCircleIcon className="w-[20px]" />
      </SidenavSectionTitle>

      <div className="flex gap-3">
        <Input placeholder="Email address" />
        <Button variant={ButtonVariant.Primary} className="px-3 py-2">
          Save
        </Button>
      </div>
    </SidenavSection>
  );
};
