import { getGpuName } from '@client/product';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context';

export const CoresIntroSentence1 = compileContent({
  deps: ['longProductName', 'shortProductName'],
  component: (props) => (
    <>
      {props.longProductName}&apos;s cores, clock speed, and cache. These specs
      have an impact on how fast the {props.shortProductName} can process
      graphics. Each type of core serves a specific computational purpose.
    </>
  ),
});

export const CoresIntro = () => {
  const { product } = useContext(ViewPageContext);

  const params = {
    longProductName: getGpuName(product),
    shortProductName: getGpuName(product, { company: false }),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <CoresIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
