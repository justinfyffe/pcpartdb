import { compileContent, ContentContext } from '@client/shared/content';
import { getProductName } from '@shared/product';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context';

export const ProcessorIntroSentence1 = compileContent({
  deps: ['productName'],
  component: (props) => (
    <>
      {props.productName}&apos;s basic details like its performance rating,
      market segment, release date, and launch price.
    </>
  ),
});

export const ProcessorIntro = () => {
  const { product } = useContext(ViewPageContext);

  const params = {
    productName: getProductName(product),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <ProcessorIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
