import { getProductName } from '@client/product';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context';

export const ApiIntroSentence1 = compileContent({
  deps: ['productName'],
  component: (props) => (
    <>
      API versions that the {props.productName} supports. Older GPUs may not
      support recent versions.
    </>
  ),
});

export const ApiIntro = () => {
  const { product } = useContext(ViewPageContext);

  const params = {
    productName: getProductName(product),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <ApiIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
