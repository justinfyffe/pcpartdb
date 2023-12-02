import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';

const ValueIntroParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <p className="text-dimmed">
      Compare {props.nameWithNoCompany}&apos;s value with similar{' '}
      {props.marketSegment} CPUs. Relative value provides insight into which
      CPUs gives the best bang for your buck. This data is based on performance
      and MSRP.
    </p>
  ),
});

export const ValueIntro = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <ValueIntroParagraph />
    </ContentContext.Provider>
  );
};
