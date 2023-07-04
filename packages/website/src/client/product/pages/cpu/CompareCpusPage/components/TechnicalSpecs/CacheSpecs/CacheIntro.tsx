import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../../shared/content';
import { ComparePageContext } from '../../../context';

export const CacheIntroParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <p className="text-dimmed">
      {props.shortCpuName1} and {props.shortCpuName2}&apos;s cache specs like
      its L1 cache and L2 cache.
    </p>
  ),
});

export const CacheIntro = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <CacheIntroParagraph />
    </ContentContext.Provider>
  );
};
