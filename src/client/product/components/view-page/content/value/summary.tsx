import { ContentContext, ContentParams } from '@client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context';

export const PerformanceSummary = () => {
  const { product, contentData } = useContext(ViewPageContext);

  const params: ContentParams = {};

  return (
    <ContentContext.Provider value={{ params }}>
      <p></p>
    </ContentContext.Provider>
  );
};
