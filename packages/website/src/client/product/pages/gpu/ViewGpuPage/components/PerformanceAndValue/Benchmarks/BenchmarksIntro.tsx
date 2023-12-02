import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';

const BenchmarksIntroSentence1 = compileContentComponent({
  component: (props) => (
    <>
      Performance and benchmark metrics for the {props.chipsetNameWithNoCompany}
      . These are usually the best indicator for determing a GPUs performance.
      This data is based on its chipset.
    </>
  ),
});
export const BenchmarksIntro = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-dimmed">
        <BenchmarksIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
