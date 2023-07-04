import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../../shared/content';
import { ViewPageContext } from '../../../context';

export const CacheIntroParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <p className="text-dimmed">
      {props.shortCpuName}&apos;s cache specs like its L1 cache and L2 cache.
    </p>
  ),
});

export const CacheIntro = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <CacheIntroParagraph />
    </ContentContext.Provider>
  );
};
