import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context/ViewPageContext';

const RatingDisclaimer = compileContentComponent({
  tags: [],
  component: (props) => (
    <p className="text-dimmed mb-0">
      *Performance rating, performance per dollar, and rankings are approximate
      values based on the {props.chipsetName}&apos;s benchmarks and MSRP.
    </p>
  ),
});

export const Disclaimer = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <RatingDisclaimer />
    </ContentContext.Provider>
  );
};
