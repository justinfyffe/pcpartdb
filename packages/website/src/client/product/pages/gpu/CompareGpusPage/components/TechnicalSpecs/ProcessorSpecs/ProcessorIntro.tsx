import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContext';

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
