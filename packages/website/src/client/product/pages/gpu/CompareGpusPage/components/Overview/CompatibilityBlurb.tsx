import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { CompareGpusContentTag } from '../../content';
import { ComparePageContext } from '../../context/ComparePageContext';

const CompatibilityIntro = compileContentComponent(
  {
    tags: [CompareGpusContentTag.DifferentSlotWidth],
    deps: ['slotWidth1', 'slotWidth2'],
    // The GeForce RTX 4090 is a thicker card that spans three PCIe slots,
    // compared to the Radeon RX 7900 XTX, which takes up two slots.
    component: (props) => (
      <>
        The {props.shortGpuName1} is a {props.gpu1ThickerOrThinner} card that
        spans {props.slotWidth1} PCIe {props.slotOrSlots1}, compared to the{' '}
        {props.shortGpuName2}, which takes up {props.slotWidth2}{' '}
        {props.slotOrSlots2}.
      </>
    ),
  },
  {
    tags: [CompareGpusContentTag.SameSlotWidth],
    deps: ['slotWidth1'],
    // The GeForce RTX 2070 and Radeon RX 7900 XTX are both 2-slot graphics cards.
    component: (props) => (
      <>
        The {props.shortGpuName1} and {props.shortGpuName2} cards span{' '}
        {props.slotWidth1} PCIe {props.slotOrSlots1}.
      </>
    ),
  },
);

const CompatibilityDimensions = compileContentComponent({
  tags: [],
  deps: ['dimensions1', 'dimensions2'],
  // The Geforce RTX 4090 takes up more PCIe slots than the Radeon RX 7900 XTX.
  component: (props) => (
    <>
      The {props.shortestGpuName1} has dimensions of {props.dimensions1},
      whereas the {props.shortestGpuName2} has dimensions of {props.dimensions2}
      .
    </>
  ),
});

const CompatibilityOutputs = compileContentComponent(
  {
    tags: [CompareGpusContentTag.DifferentOutputs],
    deps: ['outputs1', 'outputs2'],
    // In terms of display outputs, the RTX 4090 has 1x HDMI 2.1, 3x DisplayPort 1.4a,
    // while the RX 7900 XTX has 1x HDMI 2.1, 2x DisplayPort 1.4a.
    component: (props) => (
      <>
        In terms of display outputs, the {props.shortestGpuName1} has{' '}
        {props.outputs1}, while the {props.shortestGpuName2} has{' '}
        {props.outputs2}.
      </>
    ),
  },
  {
    tags: [CompareGpusContentTag.SameOutputs],
    deps: ['outputs1'],
    // The Geforce RTX 4090 takes up more PCIe slots than the Radeon RX 7900 XTX.
    component: (props) => (
      <>
        In terms of display outputs, both cards offer the same: {props.outputs1}
        .
      </>
    ),
  },
);

const CompatibilityParagraph = compileContentComponent({
  tags: [],
  deps: [],
  component: () => (
    <p>
      <CompatibilityIntro /> <CompatibilityDimensions />{' '}
      <CompatibilityOutputs />
    </p>
  ),
});

export const CompatibilityBlurb = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <CompatibilityParagraph />
    </ContentContext.Provider>
  );
};
