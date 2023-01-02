import { getGpuName } from '@client/part';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context';

export const ApiIntroSentence1 = compileContent({
  deps: ['partName'],
  component: (props) => (
    <>
      API versions that the {props.partName} supports. Older GPUs may not
      support recent versions.
    </>
  ),
});

export const ApiIntro = () => {
  const { part } = useContext(ViewPageContext);

  const params = {
    partName: getGpuName(part),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <ApiIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
