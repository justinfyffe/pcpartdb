import React from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';

export const GeneralInfoSummarySentence1 = compileContentComponent({
  deps: [],
  component: (props) => <></>,
});

export const GeneralInfoSummary = () => {
  const params = {};

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <GeneralInfoSummarySentence1 />
      </p>
    </ContentContext.Provider>
  );
};
