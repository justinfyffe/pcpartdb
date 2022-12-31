import { getGpuName } from '@client/product';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context';

export const ProcessorIntroSentence1 = compileContent({
  deps: ['productName'],
  component: (props) => (
    <>General information about {props.productName}&apos;s processor.</>
  ),
});

export const ProcessorIntro = () => {
  const { product } = useContext(ViewPageContext);

  const params = {
    productName: getGpuName(product),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <ProcessorIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
