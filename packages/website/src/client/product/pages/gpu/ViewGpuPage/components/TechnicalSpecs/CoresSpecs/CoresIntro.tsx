import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../../shared/content';
import { ViewPageContext } from '../../../context';

export const CoresIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      {props.shortGpuName}&apos;s cores, clock speed, and cache. These specs
      have an impact on how fast the {props.shortGpuName} can process graphics.
      Each type of core serves a specific computational purpose.
    </>
  ),
});

export const CoresIntro = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-dimmed">
        <CoresIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
