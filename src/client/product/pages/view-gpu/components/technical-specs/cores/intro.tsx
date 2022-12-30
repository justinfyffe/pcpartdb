import { getGpuName } from '@client/product';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context';

export const CoresIntroSentence1 = compileContent({
  deps: ['productName'],
  component: (props) => (
    <>
      {props.productName}&apos;s cores, clock speed, and cache. These specs have
      an impact on how fast the {props.productName} can process graphics. Each
      type of core serves a specific computational purpose.
    </>
  ),
});

export const CoresIntro = () => {
  const { product } = useContext(ViewPageContext);

  const params = {
    productName: getGpuName(product),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <CoresIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
