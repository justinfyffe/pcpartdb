'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import React, { FunctionComponent } from 'react';
import { SpecsTag } from '../../../content/buildProductContentTags';
import { useProductContent } from '../../../content/useProductContent';

const GraphicsAndCoolerTitle = compileContentComponent({
  tags: [],
  Component: (props) => <h3>Integrated Graphics</h3>,
});

const GraphicsSentence1 = compileContentComponent(
  {
    // GPU with integrated graphics.
    tags: [SpecsTag.IntegratedGraphics],
    deps: ['integratedGraphics'],
    Component: (props) => (
      <>
        The {props.nameWithNoCompanyNoTags} includes an integrated graphics
        solution called {props.integratedGraphics}. This graphics processor is
        directly integrated into the CPU and is not as powerful as a dedicated
        graphics card. While integrated graphics can handle basic tasks like web
        browsing and office applications, it is not suitable for more demanding
        activities such as gaming or video editing, where a dedicated graphics
        card offers superior performance.
      </>
    ),
  },
  {
    // GPU without integrated graphics.
    tags: [],
    deps: [],
    Component: (props) => (
      <>
        The {props.nameWithNoCompanyNoTags} does not include an integrated
        graphics solution. A dedicated graphics card will be required if you
        require a monitor with your computer.
      </>
    ),
  },
);

const GraphicsParagraph = compileContentComponent({
  tags: [],
  deps: [],
  Component: () => (
    <p>
      <GraphicsSentence1 />
    </p>
  ),
});

interface GraphicsBlurbProps {
  index?: number;
}

export const GraphicsBlurb: FunctionComponent<GraphicsBlurbProps> = (props) => {
  const { contentTags, contentParams } = useProductContent(props.index);

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <GraphicsAndCoolerTitle />
      <GraphicsParagraph />
    </ContentProvider>
  );
};
