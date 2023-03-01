import {
  compileContent,
  ContentContext,
} from '@pcpartdb/website/client/shared/content';
import React from 'react';

export const GeneralInfoSummarySentence1 = compileContent({
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
