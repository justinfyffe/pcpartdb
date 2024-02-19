'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import React, { FunctionComponent } from 'react';
import { SpecsTag } from '../../../content/buildProductContentTags';
import { useProductContent } from '../../../content/useProductContent';

const CompatibilitySlotWidth = compileContentComponent({
  // Example: The Geforce RTX 3070 is a large desktop graphics card,
  //          taking up 3 PCIe slots.
  tags: [SpecsTag.SlotWidth],
  component: (props) => {
    const slots = Number(props.slotWidth);
    let thickness = '';
    if (slots > 3) {
      thickness = 'very large';
    } else if (slots > 2.5) {
      thickness = 'large';
    } else if (slots >= 2) {
      thickness = 'dual slot';
    } else if (slots >= 1.5) {
      thickness = 'low-profile';
    } else if (slots < 1.5) {
      thickness = 'compact, low-profile';
    }

    const slotOrSlots = slots === 1 ? 'slot' : 'slots';
    return (
      <>
        The {props.nameWithNoCompany} is a {thickness} {props.marketSegment}{' '}
        graphics card, taking up {props.slotWidth} PCIe {slotOrSlots}.
      </>
    );
  },
});

const CompatibilityDimensions = compileContentComponent({
  // It has dimensions of 100 mm (L) x 100 mm (H).
  deps: [SpecsTag.Dimensions],
  component: (props) => <>It has dimensions of {props.dimensions}.</>,
});

const CompatibilityOutputs = compileContentComponent({
  // Example: This desktop card has 1x HDMI 2.1, 3x DisplayPort 1.4a output ports.
  tags: [SpecsTag.Outputs],
  component: (props) => (
    <>
      This {props.marketSegment} card has {props.outputs} output ports.
    </>
  ),
});

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

interface CompatibilityBlurbProps {}

export const CompatibilityBlurb: FunctionComponent<CompatibilityBlurbProps> = (
  _props,
) => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <CompatibilityParagraph />
    </ContentProvider>
  );
};
