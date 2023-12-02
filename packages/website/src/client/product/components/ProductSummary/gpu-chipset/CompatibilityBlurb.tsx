import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import {
  ContentParams,
  ContentTags,
} from 'packages/website/src/client/shared/content/types';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { FunctionComponent } from 'react';
import { SpecsTag } from '../../../content/tags';

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
        The {props.nameWithNoCompanyNoBrand} is a {thickness} graphics card,
        taking up {props.slotWidth} PCIe {slotOrSlots}.
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

interface CompatibilityBlurbProps {
  tags?: ContentTags;
  params?: ContentParams;
}

export const CompatibilityBlurb: FunctionComponent<CompatibilityBlurbProps> = (
  props,
) => {
  const { tags, params } = props;
  const context = { tags, params };

  return (
    <ContentContext.Provider value={context}>
      <CompatibilityParagraph />
    </ContentContext.Provider>
  );
};
