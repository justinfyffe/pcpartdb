import { getProductName } from '@client/product';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context';

export const BenchmarksIntroSentence1 = compileContent({
  deps: ['productName'],
  component: (props) => (
    <>
      Performance and benchmark metrics for the {props.productName}. These are
      usually the best indicator for determing a GPUs performance.
    </>
  ),
});

export const BenchmarksIntro = () => {
  const { product } = useContext(ViewPageContext);

  const params = {
    productName: getProductName(product),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <BenchmarksIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
