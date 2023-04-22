import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { ViewPageContext } from '../../../context';

export const ApiIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      API versions that the {props.shortGpuName} supports. Older GPUs may not
      support recent versions.
    </>
  ),
});

export const ApiIntro = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-content-dimmed">
        <ApiIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
