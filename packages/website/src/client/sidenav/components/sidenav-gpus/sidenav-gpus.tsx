import { getViewGpuPath, Gpu } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { getGpuName, getViewGpuSlug } from '../../../gpus';
import { classNames } from '../../../shared/ui';
import { SidenavSection, SidenavSectionTitle } from '../sidenav';

interface SidenavGpusProps {
  gpus?: Gpu[];
  className?: string;
}

export const SidenavGpus: FunctionComponent<SidenavGpusProps> = (props) => {
  const gpus = props.gpus || [];

  if (gpus.length === 0) {
    return <></>;
  }

  return (
    <SidenavSection
      className={classNames('flex flex-col gap-3', props.className)}
    >
      <SidenavSectionTitle>Related GPUs</SidenavSectionTitle>

      <div className="flex flex-col gap-4">
        {gpus.map((gpu) => (
          <GpuListing key={gpu.id} gpu={gpu} />
        ))}
      </div>
    </SidenavSection>
  );
};

interface GpuListingProps {
  gpu: Gpu;
}

const GpuListing: FunctionComponent<GpuListingProps> = (props) => {
  const { gpu } = props;

  return (
    <a
      href={getViewGpuPath(getViewGpuSlug(gpu))}
      className="flex items-center gap-3 px-3 py-3 border-px rounded text-sm"
    >
      <div className="flex-1">{getGpuName(gpu)}</div>
    </a>
  );
};
