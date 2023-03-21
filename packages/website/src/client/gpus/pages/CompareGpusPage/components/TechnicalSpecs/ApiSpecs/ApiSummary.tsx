import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentComponentParams,
  ContentContext,
} from '../../../../../../shared/content';
import { ComparePageContext } from '../../../context';

export const ApiSummarySentence1 = compileContentComponent({
  deps: [],
  component: (props) => <></>,
});

export const ApiSummary = () => {
  const { comparison } = useContext(ComparePageContext);

  const params: ContentComponentParams = {};

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <ApiSummarySentence1 />
      </p>
    </ContentContext.Provider>
  );
};
