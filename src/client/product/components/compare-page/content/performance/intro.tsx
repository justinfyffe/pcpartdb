import { compileContent, ContentContext } from '@client/shared/content';
import { getProductName } from '@shared/product';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../context';

export const PerformanceIntroSentence1 = compileContent({
  deps: ['productName1', 'productName2'],
  component: (props) => (
    <>
      Compare {props.productName1} and {props.productName2}&apos;s performance
      with similar GPUs. Relative performance provides insight into how their
      benchmarks compare to its peers.
    </>
  ),
});

export const PerformanceIntro = () => {
  const { comparison } = useContext(ComparePageContext);
  const [product1, product2] = comparison;

  const params = {
    productName1: getProductName(product1),
    productName2: getProductName(product2),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <PerformanceIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
