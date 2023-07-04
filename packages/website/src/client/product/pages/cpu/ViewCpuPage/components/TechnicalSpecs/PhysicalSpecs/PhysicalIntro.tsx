import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../../shared/content';
import { ViewPageContext } from '../../../context';

export const PhysicalIntroParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <p className="text-dimmed">
      {props.shortCpuName}&apos;s physical and architecture specs like its
      codename, generation, PCI Express versions, and chipsets.
    </p>
  ),
});

export const PhysicalIntro = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <PhysicalIntroParagraph />
    </ContentContext.Provider>
  );
};
