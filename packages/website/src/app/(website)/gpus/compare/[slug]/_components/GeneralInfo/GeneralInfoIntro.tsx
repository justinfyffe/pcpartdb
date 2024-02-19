'use client';

import { formatProductName, GpuProductComparison } from '@pcpartdb/shared';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import React from 'react';

export const GeneralInfoIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      General information about the {props.name1} and {props.name2} like their
      manufacturer, release date, launch price, and production status.
    </>
  ),
});

interface GeneralInfoIntroProps {
  comparison: GpuProductComparison;
}

export function GeneralInfoIntro(props: GeneralInfoIntroProps) {
  const { comparison } = props;
  const [gpu1, gpu2] = comparison;

  const name1 = formatProductName(gpu1, { company: false });
  const name2 = formatProductName(gpu2, { company: false });

  return (
    <ContentProvider params={{ params: { name1, name2 } }}>
      <p className="text-dimmed">
        <GeneralInfoIntroSentence1 />
      </p>
    </ContentProvider>
  );
}
