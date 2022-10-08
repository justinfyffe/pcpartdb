import { Button, ButtonVariant, TextInput } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import { InformationCircleIcon } from '@heroicons/react/outline';
import React, { FunctionComponent } from 'react';
import { SidenavSection, SidenavSectionTitle } from './sidenav';

interface SidenavStockUpdatesProps {
  className?: string;
}

export const SidenavStockUpdates: FunctionComponent<
  SidenavStockUpdatesProps
> = (props) => {
  return (
    <SidenavSection
      className={classNames('flex flex-col gap-3', props.className)}
    >
      <SidenavSectionTitle>
        Notify me of stock updates{' '}
        <InformationCircleIcon className="w-[20px]" />
      </SidenavSectionTitle>

      <div className="flex gap-3">
        <TextInput placeholder="Email address" className="flex-1" />
        <Button variant={ButtonVariant.Primary} className="px-3 py-2">
          Save
        </Button>
      </div>
    </SidenavSection>
  );
};
