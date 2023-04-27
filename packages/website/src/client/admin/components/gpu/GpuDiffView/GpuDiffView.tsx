import { GpuDiff } from '@pcpartdb/shared';
import {
  Button,
  ButtonVariant,
} from 'packages/website/src/client/shared/components';
import React, { FunctionComponent, useState } from 'react';
import { FormattedDiffTab } from './FormattedDiffTab';
import { RawDiffTab } from './RawDiffTab';

enum Tab {
  Formatted,
  Raw,
}

interface GpuDiffViewProps {
  diff: GpuDiff;
}

export const GpuDiffView: FunctionComponent<GpuDiffViewProps> = (props) => {
  const { diff } = props;
  const [tab, setTab] = useState(Tab.Formatted);

  return (
    <div className="flex flex-col gap-4 max-h-full">
      <div className="flex gap-4">
        <Button
          className="flex-1"
          variant={
            tab === Tab.Formatted
              ? ButtonVariant.Primary
              : ButtonVariant.Default
          }
          onClick={() => setTab(Tab.Formatted)}
        >
          Formatted Diff
        </Button>
        <Button
          className="flex-1"
          variant={
            tab === Tab.Raw ? ButtonVariant.Primary : ButtonVariant.Default
          }
          onClick={() => setTab(Tab.Raw)}
        >
          Raw Diff
        </Button>
      </div>

      <div className="overflow-auto flex-1">
        {tab === Tab.Formatted ? <FormattedDiffTab diff={diff} /> : <></>}
        {tab === Tab.Raw ? <RawDiffTab diff={diff} /> : <></>}
      </div>
    </div>
  );
};
