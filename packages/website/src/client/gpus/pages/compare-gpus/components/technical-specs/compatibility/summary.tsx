import React, { useContext } from 'react';
import {
  compileContent,
  ContentContext,
  ContentParams,
} from '../../../../../../shared/content';
import { ComparePageContext } from '../../../context';

export const CompatibilitySummarySentence1 = compileContent({
  deps: [],
  component: (props) => <></>,
});

export const CompatibillitySummary = () => {
  const { comparison } = useContext(ComparePageContext);

  const params: ContentParams = {};

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <CompatibilitySummarySentence1 />
      </p>
    </ContentContext.Provider>
  );
};
