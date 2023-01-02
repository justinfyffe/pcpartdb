import { getGpuName } from '@client/part';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context';

export const ValueIntroSentence1 = compileContent({
  deps: ['partName'],
  component: (props) => (
    <>
      Compare {props.partName}&apos;s value with similar GPUs. Relative value
      provides insight into which GPU gives the best bang for your buck.
    </>
  ),
});

export const ValueIntro = () => {
  const { part } = useContext(ViewPageContext);

  const params = {
    partName: getGpuName(part),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <ValueIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
