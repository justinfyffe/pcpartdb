import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../context/ComparePageContext';

const GeneralInfoParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <p className="text-dimmed">
      General information about the {props.shortCpuName1} and{' '}
      {props.shortCpuName2} like their performance rating, performance per
      dollar, release date, launch price, and production status.
    </p>
  ),
});

export const GeneralInfoIntro = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <GeneralInfoParagraph />
    </ContentContext.Provider>
  );
};
