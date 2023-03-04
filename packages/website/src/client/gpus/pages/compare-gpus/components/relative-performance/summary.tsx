import React, { useContext } from 'react';
import {
  compileContent,
  ContentContext,
  ContentParams,
} from '../../../../../shared/content';
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
