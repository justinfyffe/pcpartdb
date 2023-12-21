import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContextProvider';

const ValueIntroSentence1 = compileContentComponent({
  component: (props) => (
    <>
      Compare {props.chipsetNameWithNoCompany}&apos;s value with similar{' '}
      {props.marketSegment} GPUs. Relative value provides insight into which GPU
      gives the best bang for your buck. This data is based on its{' '}
      {props.preferredBenchmarkName} performance and MSRP.
    </>
  ),
});

export const ValueIntro = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-dimmed">
        <ValueIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
