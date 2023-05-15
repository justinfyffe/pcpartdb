import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { ViewPageContext } from '../../context';

const GeneralInfoIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      General information about the {props.shortGpuName} like its performance,
      release date, and launch price. Performance rating and performance per
      dollar are based on its chipset.
    </>
  ),
});

export const GeneralInfoIntro = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-content-dimmed">
        <GeneralInfoIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
