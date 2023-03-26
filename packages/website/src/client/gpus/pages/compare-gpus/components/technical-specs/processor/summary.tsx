import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
  ContentComponentParams,
} from '../../../../../../shared/content';
import { ComparePageContext } from '../../../context';

export const ProcessorSummarySentence1 = compileContentComponent({
  deps: [],
  component: (props) => <></>,
});

export const ProcessorSummary = () => {
  const { comparison } = useContext(ComparePageContext);

  const params: ContentComponentParams = {};

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <ProcessorSummarySentence1 />
      </p>
    </ContentContext.Provider>
  );
};
