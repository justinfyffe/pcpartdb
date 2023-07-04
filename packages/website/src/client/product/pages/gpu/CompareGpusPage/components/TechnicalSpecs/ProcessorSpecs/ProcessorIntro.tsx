import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../../shared/content';
import { ComparePageContext } from '../../../context';

export const ProcessorIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      General information about the processors for the {props.shortGpuName1} and{' '}
      {props.shortGpuName2}.
    </>
  ),
});

export const ProcessorIntro = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-dimmed">
        <ProcessorIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
