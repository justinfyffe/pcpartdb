import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@client/shared/content';
import { getProductName } from '@shared/product';
import { getShoppingUrl } from '@shared/retail-model';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context';

interface Params extends ContentParams {
  productName?: string;
  shoppingUrl?: string;
}

export const IntroSentence1 = compileContent({
  deps: ['productName', 'shoppingUrl'],
  component: (props: Params) => (
    <>
      <a href={props.shoppingUrl}>Check the current availability and price</a>{' '}
      of the {props.productName}.
    </>
  ),
});

export const IntroSentence2 = compileContent({
  component: () => (
    <>See below for a comprehensive list of benchmarks, reviews, and specs.</>
  ),
});

export const IntroParagraph = () => {
  const { product } = useContext(ViewPageContext);

  const params: Params = {
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
