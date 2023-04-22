import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { ComparePageContext } from '../../context';

export const GeneralInfoIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      General information about the {props.shortGpuName1} and{' '}
      {props.shortGpuName2} like their performance rating, release date, and
      launch price.
    </>
  ),
});

export const GeneralInfoIntro = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-content-dimmed">
        <GeneralInfoIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
