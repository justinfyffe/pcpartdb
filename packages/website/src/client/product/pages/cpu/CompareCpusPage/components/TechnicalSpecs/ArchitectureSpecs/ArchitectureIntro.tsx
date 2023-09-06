import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContext';

export const ArchitectureIntroParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <p className="text-dimmed">
      {props.shortCpuName1} and {props.shortCpuName2}&apos;s architecture specs
      like its codename, memory support, PCI Express, and chipsets.
    </p>
  ),
});

export const ArchitectureIntro = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <ArchitectureIntroParagraph />
    </ContentContext.Provider>
  );
};
