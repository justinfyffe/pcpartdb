import React, { useContext, useMemo } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { getGpuName } from '../../../../..';
import { ViewPageContext } from '../../../context';

export const CoresIntroSentence1 = compileContentComponent({
  deps: ['longGpuName', 'shortGpuName'],
  component: (props) => (
    <>
      {props.longGpuName}&apos;s cores, clock speed, and cache. These specs have
      an impact on how fast the {props.shortGpuName} can process graphics. Each
      type of core serves a specific computational purpose.
    </>
  ),
});

export const CoresIntro = () => {
  const { gpu } = useContext(ViewPageContext);

  const context = useMemo(() => {
    const params = {
      longGpuName: getGpuName(gpu),
      shortGpuName: getGpuName(gpu, { company: false }),
    };

    return { params };
  }, [gpu]);

  return (
    <ContentContext.Provider value={context}>
      <p className="text-content-dimmed">
        <CoresIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
