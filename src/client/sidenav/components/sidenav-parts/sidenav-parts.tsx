import { getGpuName, getViewGpuSlug } from '@client/part';
import { classNames } from '@client/shared/ui';
import { getViewGpuPath } from '@client/shared/website';
import { Part } from '@shared/part';
import React, { FunctionComponent } from 'react';
import { SidenavSection, SidenavSectionTitle } from '../sidenav';

interface SidenavPartsProps {
  parts?: Part[];
  className?: string;
}

export const SidenavParts: FunctionComponent<SidenavPartsProps> = (props) => {
  const parts = props.parts || [];

  return (
    <SidenavSection
      className={classNames('flex flex-col gap-3', props.className)}
    >
      <SidenavSectionTitle>Related GPUs</SidenavSectionTitle>

      <div className="flex flex-col gap-4">
        {parts.map((part) => (
          <PartListing key={part.id} part={part} />
        ))}
      </div>
    </SidenavSection>
  );
};

interface PartListingProps {
  part: Part;
}

const PartListing: FunctionComponent<PartListingProps> = (props) => {
  const { part } = props;

  return (
    <a
      href={getViewGpuPath(getViewGpuSlug(part))}
      className="flex items-center gap-3 px-3 py-3 border-px rounded text-sm"
    >
      <div className="flex-1">{getGpuName(part)}</div>
    </a>
  );
};
