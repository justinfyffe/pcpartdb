'use client';

import { CpuProductComparison, formatProductName } from '@pcpartdb/shared';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import React from 'react';

const GeneralInfoParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <p className="text-dimmed">
      General information about the {props.name1} and {props.name2} like their
      performance rating, performance per dollar, release date, launch price,
      and production status.
    </p>
  ),
});

interface GeneralInfoIntroProps {
  comparison: CpuProductComparison;
}

export function GeneralInfoIntro(props: GeneralInfoIntroProps) {
  const { comparison } = props;
  const [cpu1, cpu2] = comparison;

  const name1 = formatProductName(cpu1, { company: false });
  const name2 = formatProductName(cpu2, { company: false });

  return (
    <ContentProvider params={{ params: { name1, name2 } }}>
      <GeneralInfoParagraph />
    </ContentProvider>
  );
}
