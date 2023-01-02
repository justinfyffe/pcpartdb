import { getGpuName } from '@client/part';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context';

export const CoresIntroSentence1 = compileContent({
  deps: ['longPartName', 'shortPartName'],
  component: (props) => (
    <>
      {props.longPartName}&apos;s cores, clock speed, and cache. These specs
      have an impact on how fast the {props.shortPartName} can process graphics.
      Each type of core serves a specific computational purpose.
    </>
  ),
});

export const CoresIntro = () => {
  const { part } = useContext(ViewPageContext);

  const params = {
    longPartName: getGpuName(part),
    shortPartName: getGpuName(part, { company: false }),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <CoresIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
