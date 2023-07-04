import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { ComparePageContext } from '../../context';

const BenchmarksParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <p className="text-dimmed">
      Performance and benchmark metrics for the {props.shortCpuName1} and{' '}
      {props.shortCpuName2}. These are usually the best indicator for determing
      a CPUs performance.
    </p>
  ),
});

export const BenchmarksIntro = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <BenchmarksParagraph />
    </ContentContext.Provider>
  );
};
