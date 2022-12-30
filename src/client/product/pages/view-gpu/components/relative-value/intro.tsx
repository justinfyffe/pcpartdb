import { getGpuName } from '@client/product';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context';

export const ValueIntroSentence1 = compileContent({
  deps: ['productName'],
  component: (props) => (
    <>
      Compare {props.productName}&apos;s value with similar GPUs. Relative value
      provides insight into which GPU gives the best bang for your buck.
    </>
  ),
});

export const ValueIntro = () => {
  const { product } = useContext(ViewPageContext);

  const params = {
    productName: getGpuName(product),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <ValueIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
