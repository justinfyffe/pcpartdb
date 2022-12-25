import { compileContent, ContentContext } from '@client/shared/content';
import { getProductName } from '@shared/product';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../../context';

export const ApiIntroSentence1 = compileContent({
  deps: ['productName1', 'productName2'],
  component: (props) => (
    <>
      API versions that the {props.productName1} and {props.productName2}{' '}
      supports. Older GPUs may not support recent versions.
    </>
  ),
});

export const ApiIntro = () => {
  const { comparison } = useContext(ComparePageContext);
  const [product1, product2] = comparison;

  const params = {
    productName1: getProductName(product1),
    productName2: getProductName(product2),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <ApiIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
