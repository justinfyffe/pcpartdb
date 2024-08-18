'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import React, { FunctionComponent } from 'react';
import { SpecsTag } from '../../../content/buildProductContentTags';
import { useProductContent } from '../../../content/useProductContent';

const CompatibilityTitle = compileContentComponent(
  {
    tags: [SpecsTag.SlotWidth],
    Component: (props) => <>Compatibility</>,
  },
  {
    tags: [SpecsTag.Outputs],
    Component: (props) => <>Compatibility</>,
  },
  {
    tags: [SpecsTag.Tdp],
    Component: (props) => <>Compatibility</>,
  },
  {
    tags: [SpecsTag.SuggestedPsu],
    Component: (props) => <>Compatibility</>,
  },
);

const CompatibilitySlotWidth = compileContentComponent({
  // Example: The Geforce RTX 3070 is a large desktop graphics card,
  //          taking up 3 PCIe slots.
  tags: [SpecsTag.SlotWidth],
  Component: (props) => {
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
        The {props.nameWithNoCompanyNoBrandNoTags} is a {thickness} graphics
        card, taking up {props.slotWidth} PCIe {slotOrSlots}.
      </>
    );
  },
});

const CompatibilityOutputs = compileContentComponent({
  // Example: This desktop card has 1x HDMI 2.1, 3x DisplayPort 1.4a output ports.
  tags: [SpecsTag.Outputs],
  Component: (props) => <>It supports {props.outputs} display ports.</>,
});

const PowerSupplyTdp = compileContentComponent({
  tags: [SpecsTag.Tdp],
  Component: (props) => (
    <>
      This {props.marketSegment} card has a TDP of {props.tdp}.
    </>
  ),
});

const PowerSupplySuggestedPsu = compileContentComponent({
  tags: [SpecsTag.SuggestedPsu],
  Component: (props) => (
    <>
      {props.company} recommends using a power supply of at least{' '}
      {props.suggestedPsu} with this card. A power supply lower than this might
      result in system crashes and potentially damage your hardware.
    </>
  ),
});

const CompatibilityParagraph = compileContentComponent({
  tags: [],
  deps: [],
  Component: () => (
    <p>
      <CompatibilitySlotWidth /> <CompatibilityOutputs /> <PowerSupplyTdp />{' '}
      <PowerSupplySuggestedPsu />
    </p>
  ),
});

interface CompatibilityBlurbProps {
  index: number;
}

export const CompatibilityBlurb: FunctionComponent<CompatibilityBlurbProps> = (
  props,
) => {
  const { contentTags, contentParams } = useProductContent(props.index);

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <h3>
        <CompatibilityTitle />
      </h3>
      <CompatibilityParagraph />
    </ContentProvider>
  );
};
