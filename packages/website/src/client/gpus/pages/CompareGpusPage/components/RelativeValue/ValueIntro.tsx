import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { ComparePageContext } from '../../context';

export const ValueIntroSentence1 = compileContentComponent({
  deps: ['gpuName1', 'gpuName2'],
  component: (props) => (
    <>
      Compare {props.gpuName1} and {props.gpuName2}&apos;s value with similar
      GPUs. Relative value provides insight into which GPUs give the better bang
      for your buck.
    </>
  ),
});

export const ValueIntro = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-content-dimmed">
        <ValueIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
