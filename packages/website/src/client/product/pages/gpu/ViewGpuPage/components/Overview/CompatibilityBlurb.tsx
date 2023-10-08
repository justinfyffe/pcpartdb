import { hasProductFieldFormattedValue } from '@pcpartdb/shared';
import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { ViewGpuContentTag } from '../../content/getContentTags';
import { ViewPageContext } from '../../context/ViewPageContext';

const CompatibilitySlotWidth = compileContentComponent({
  deps: ['slotWidth', 'slotOrSlots'],
  component: (props) => (
    <>
      The {props.shortGpuName} is a {props.thickness} {props.marketSegment}{' '}
      graphics card, taking up {props.slotWidth} PCIe {props.slotOrSlots}.
    </>
  ),
});

const CompatibilityDimensions = compileContentComponent({
  deps: ['dimensions'],
  component: (props) => <>It has dimensions of {props.dimensions}.</>,
});

const CompatibilityOutputs = compileContentComponent(
  {
    tags: [ViewGpuContentTag.IsIntegrated],
    deps: [],
    component: () => <></>,
  },
  {
    tags: [ViewGpuContentTag.IsMobile],
    deps: [],
    component: () => <></>,
  },
  {
    tags: [],
    deps: ['slotWidth', 'outputs'],
    // This desktop card has 1x HDMI 2.1, 3x DisplayPort 1.4a output ports.
    component: (props) => (
      <>
        This {props.marketSegment} card has {props.outputs} output ports.
      </>
    ),
  },
);

const CompatibilityParagraph = compileContentComponent({
  tags: [],
  deps: [],
  component: () => (
    <p>
      <CompatibilitySlotWidth /> <CompatibilityDimensions />{' '}
      <CompatibilityOutputs />
    </p>
  ),
});

export const CompatibilityBlurb = () => {
  const { gpu, contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  if (!hasProductFieldFormattedValue(gpu.fields?.slotWidth)) {
    return <></>;
  }

  return (
    <ContentContext.Provider value={context}>
      <CompatibilityParagraph />
    </ContentContext.Provider>
  );
};
