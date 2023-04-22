import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { ComparePageContext } from '../../../context';

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
      <p className="text-content-dimmed">
        <CoresIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
