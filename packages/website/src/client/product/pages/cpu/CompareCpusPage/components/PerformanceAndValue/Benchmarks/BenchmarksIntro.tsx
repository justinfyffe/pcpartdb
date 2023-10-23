import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContext';

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
