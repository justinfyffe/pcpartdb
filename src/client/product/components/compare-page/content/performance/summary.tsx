import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@client/shared/content';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../context';

export const PerformanceSummarySentence1 = compileContent({
  deps: [],
  component: (props) => <></>,
});

export const PerformanceSummary = () => {
  const { comparison, contentData } = useContext(ComparePageContext);

  const params: ContentParams = {};

  return (
    <ContentContext.Provider value={{ params }}>
      <p></p>
    </ContentContext.Provider>
  );
};
