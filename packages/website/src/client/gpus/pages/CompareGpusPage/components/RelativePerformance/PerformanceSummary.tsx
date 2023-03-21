import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentComponentParams,
  ContentContext,
} from '../../../../../shared/content';
import { ComparePageContext } from '../../context';

export const PerformanceSummarySentence1 = compileContentComponent({
  deps: [],
  component: (props) => <></>,
});

export const PerformanceSummary = () => {
  const { comparison, contentData } = useContext(ComparePageContext);

  const params: ContentComponentParams = {};

  return (
    <ContentContext.Provider value={{ params }}>
      <p></p>
    </ContentContext.Provider>
  );
};
