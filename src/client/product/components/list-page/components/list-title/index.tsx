import { ContentContext } from '@client/shared/content';
import { ProductsSort } from '@shared/product';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ListPageContext } from '../../context';
import { SubtitleSentence1, TitleSentence1 } from './content';

export const ListTitle: FunctionComponent = () => {
  const { query } = useContext(ListPageContext);

  const filters = {
    [query.orderBy?.sort ?? ProductsSort.PerformanceRating]: true,
  };

  return (
    <ContentContext.Provider value={{ filters }}>
      <div>
        <h1 className="md:text-2xl text-3xl mb-0">
          <TitleSentence1 />
        </h1>

        <p className="text-content-dimmed mb-0">
          <SubtitleSentence1 />
        </p>
      </div>
    </ContentContext.Provider>
  );
};
