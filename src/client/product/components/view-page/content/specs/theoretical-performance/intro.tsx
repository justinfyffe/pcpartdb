import { compileContent, ContentContext } from '@client/shared/content';
import { getProductName } from '@shared/product';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context';

export const TheoreticalPerformanceIntroSentence1 = compileContent({
  deps: ['productName'],
  component: (props) => (
    <>
      {props.productName}&apos;s computational performance like pixel fill rate,
      texture fill rate, and floating-point operations per second. This is the
      calculated performance based on TMUs, ROPs, cores, and clock frequency.
    </>
  ),
});

export const TheoreticalPerformanceIntro = () => {
  const { product } = useContext(ViewPageContext);

  const params = {
    productName: getProductName(product),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <TheoreticalPerformanceIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
