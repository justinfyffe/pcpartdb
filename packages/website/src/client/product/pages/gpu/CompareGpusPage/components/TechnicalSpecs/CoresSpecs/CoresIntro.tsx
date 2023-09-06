import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContext';

export const CoresIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      {props.shortGpuName1} and {props.shortGpuName2}&apos;s cores, clock speed,
      and cache. These specs have an impact on how fast the{' '}
      {props.shortestGpuName1} and {props.shortestGpuName2} can process
      graphics. Each type of core serves a specific computational purpose.
    </>
  ),
});

export const CoresIntro = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-dimmed">
        <CoresIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
