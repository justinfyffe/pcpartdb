import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { ViewPageContext } from '../../context';

const BenchmarksIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      Performance and benchmark metrics for the {props.shortGpuName}. These are
      usually the best indicator for determing a GPUs performance. This data is
      based on its chipset.
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
