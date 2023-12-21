import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContextProvider';

export const CompatibilityIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      {props.nameWithNoCompany}&apos;s dimensions, bus interface, power
      consumption, and output ports. These specs are useful for verifying that
      the {props.nameWithNoCompanyNoBrand} fits within your case and is
      compatible with your motherboard, power supply, and monitor.
    </>
  ),
});

export const CompatibilityIntro = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p className="text-dimmed">
        <CompatibilityIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
