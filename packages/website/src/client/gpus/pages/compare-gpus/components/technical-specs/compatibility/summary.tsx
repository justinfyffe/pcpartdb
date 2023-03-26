import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
  ContentComponentParams,
} from '../../../../../../shared/content';
import { ComparePageContext } from '../../../context';

export const CompatibilitySummarySentence1 = compileContentComponent({
  deps: [],
  component: (props) => <></>,
});

export const CompatibillitySummary = () => {
  const { comparison } = useContext(ComparePageContext);

  const params: ContentComponentParams = {};

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <CompatibilitySummarySentence1 />
      </p>
    </ContentContext.Provider>
  );
};
