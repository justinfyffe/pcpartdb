import { compileContent, ContentContext } from '@client/shared/content';
import { getProductName } from '@shared/product';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context';

export const PerformanceIntroSentence1 = compileContent({
  deps: ['productName'],
  component: (props) => (
    <>
      Compare {props.productName}&apos;s performance with similar GPUs. Relative
      performance provides insight into how its benchmarks compare to its peers.
    </>
  ),
});

export const PerformanceIntro = () => {
  const { product } = useContext(ViewPageContext);

  const params = {
    productName: getProductName(product),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <PerformanceIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
