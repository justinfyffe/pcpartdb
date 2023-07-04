import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { ViewPageContext } from '../../context';

const GeneralInfoParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <p className="text-dimmed">
      General information about the {props.shortCpuName} like its performance
      rating, performance per dollar, release date, launch price, and production
      status.
    </p>
  ),
});

export const GeneralInfoIntro = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <GeneralInfoParagraph />
    </ContentContext.Provider>
  );
};
