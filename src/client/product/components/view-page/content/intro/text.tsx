import { getProductName } from '@client/product';
import { compileContent, ContentContext } from '@client/shared/content';
import { getShoppingUrl } from '@shared/retail-model';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context';

export const IntroSentence1 = compileContent({
  deps: ['productName', 'shoppingUrl'],
  component: (props) => (
    <>
      <a href={props.shoppingUrl as string}>
        View the current availability and price
      </a>{' '}
      for the {props.productName}.
    </>
  ),
});

export const IntroSentence2 = compileContent({
  component: () => (
    <>Check below for a comprehensive list of benchmarks and specs.</>
  ),
});

export const IntroParagraph = () => {
  const { product } = useContext(ViewPageContext);

  const params = {
    productName: getProductName(product),
    shoppingUrl: getShoppingUrl(product),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <IntroSentence1 /> <IntroSentence2 />
      </p>
    </ContentContext.Provider>
  );
};
