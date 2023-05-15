import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { ViewGpuContentTag } from '../../content';
import { ViewPageContext } from '../../context';

const CompatibilitySlotWidth = compileContentComponent({
  deps: ['slotWidthNoUnits', 'slotWidthUnits'],
  component: (props) => (
    <>
      The {props.shortGpuName} is a {props.thickness} {props.marketSegment}{' '}
      graphics card, taking up {props.slotWidthNoUnits} PCIe{' '}
      {props.slotWidthUnits}.
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

  if (gpu.slotWidth?.value == null) {
    return <></>;
  }

  return (
    <ContentContext.Provider value={context}>
      <CompatibilityParagraph />
    </ContentContext.Provider>
  );
};
