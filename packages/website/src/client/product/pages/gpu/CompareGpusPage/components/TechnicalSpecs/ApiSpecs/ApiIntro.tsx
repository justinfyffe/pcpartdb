import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../../shared/content';
import { ComparePageContext } from '../../../context';

export const ApiIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      API versions that the {props.shortGpuName1} and {props.shortGpuName2}{' '}
      supports. Older GPUs may not support recent versions.
    </>
  ),
});

export const ApiIntro = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-dimmed">
        <ApiIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
