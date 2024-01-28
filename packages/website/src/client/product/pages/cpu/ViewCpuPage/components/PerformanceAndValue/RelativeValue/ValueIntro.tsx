import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContextProvider';

const ValueIntroParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      Compare {props.nameWithNoCompany}&apos;s value with similar{' '}
      {props.marketSegment} CPUs. This provides insight into which CPUs gives
      the best bang for your buck. This data is based on{' '}
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
        <ValueIntroParagraph />
      </p>
    </ContentContext.Provider>
  );
};
