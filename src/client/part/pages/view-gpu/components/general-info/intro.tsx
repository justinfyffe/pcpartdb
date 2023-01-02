import { getGpuName } from '@client/part';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context';

export const GeneralInfoIntroSentence1 = compileContent({
  deps: ['partName'],
  component: (props) => (
    <>
      General information about the {props.partName} like its performance
      rating, release date, and launch price.
    </>
  ),
});

export const GeneralInfoIntro = () => {
  const { part } = useContext(ViewPageContext);

  const params = {
    partName: getGpuName(part),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <GeneralInfoIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
