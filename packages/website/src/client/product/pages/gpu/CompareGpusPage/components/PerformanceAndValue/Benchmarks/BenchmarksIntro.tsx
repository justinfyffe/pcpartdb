import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContext';

export const BenchmarksIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      Performance and benchmark metrics for the {props.shortGpuName1} and{' '}
      {props.shortGpuName2}. These are usually the best indicator for determing
      a GPUs performance. This data is based on their chipsets.
    </>
  ),
});

export const BenchmarksIntro = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-dimmed">
        <BenchmarksIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
