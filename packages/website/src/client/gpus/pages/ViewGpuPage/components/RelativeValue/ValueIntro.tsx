import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { ViewPageContext } from '../../context';

export const ValueIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      Compare {props.shortGpuName}&apos;s value with similar GPUs. Relative
      value provides insight into which GPU gives the best bang for your buck.
    </>
  ),
});

export const ValueIntro = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-content-dimmed">
        <ValueIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
