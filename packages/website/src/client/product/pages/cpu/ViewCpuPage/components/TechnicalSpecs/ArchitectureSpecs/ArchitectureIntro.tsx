import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../../shared/content';
import { ViewPageContext } from '../../../context';

export const ArchitectureIntroParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <p className="text-dimmed">
      {props.shortCpuName}&apos;s architecture specs like its codename, memory
      support, PCI Express, and chipsets.
    </p>
  ),
});

export const ArchitectureIntro = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <ArchitectureIntroParagraph />
    </ContentContext.Provider>
  );
};
