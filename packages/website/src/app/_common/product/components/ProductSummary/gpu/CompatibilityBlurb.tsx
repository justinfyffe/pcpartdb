'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import pluralize from 'pluralize';
import React, { FunctionComponent } from 'react';
import { SpecsTag } from '../../../content/buildProductContentTags';
import { useProductContent } from '../../../content/useProductContent';

const CompatibilityTitle = compileContentComponent(
  {
    tags: [SpecsTag.SlotWidth],
    Component: (props) => <h3>Compatibility &amp; Power Consumption</h3>,
  },
  {
    tags: [SpecsTag.Tdp],
    Component: (props) => <h3>Compatibility &amp; Power Consumption</h3>,
  },
  {
    tags: [SpecsTag.SuggestedPsu],
    Component: (props) => <h3>Compatibility &amp; Power Consumption</h3>,
  },
);

const CompatibilitySentence1 = compileContentComponent(
  {
    // TODO: add or ability so we can limit to workstations and desktops
    // TODO: combine tags and deps? Maybe a config property
    // GPUs with a slot width and bus interface that is very large.
    tags: [SpecsTag.SlotWidth, SpecsTag.BusInterface],
    deps: ['isVeryLarge', 'slotWidth', 'busInterface'],
    Component: (props) => {
      const slots = Number(props.slotWidth);
      const slotsText = pluralize('slot', slots);
      return (
        <>
          The {props.nameWithNoCompanyNoBrandNoTags} is a massive graphics card,
          occupying {slots} {props.busInterface} expansion {slotsText}.
        </>
      );
    },
  },
  {
    // GPUs with a slot width that is very large.
    tags: [SpecsTag.SlotWidth],
    deps: ['isVeryLarge', 'slotWidth'],
    Component: (props) => {
      const slots = Number(props.slotWidth);
      const slotsText = pluralize('slot', slots);
      return (
        <>
          The {props.nameWithNoCompanyNoBrandNoTags} is a massive graphics card,
          occupying {slots} PCIe expansion {slotsText}.
        </>
      );
    },
  },
  {
    // GPUs with a slot width and bus interface that is large.
    tags: [SpecsTag.SlotWidth, SpecsTag.BusInterface],
    deps: ['isLarge', 'slotWidth', 'busInterface'],
    Component: (props) => {
      const slots = Number(props.slotWidth);
      const slotsText = pluralize('slot', slots);
      return (
        <>
          The {props.nameWithNoCompanyNoBrandNoTags} is a large graphics card,
          occupying {slots} {props.busInterface} expansion {slotsText}.
        </>
      );
    },
  },
  {
    // GPUs with a slot width that is large.
    tags: [SpecsTag.SlotWidth],
    deps: ['isLarge', 'slotWidth'],
    Component: (props) => {
      const slots = Number(props.slotWidth);
      const slotsText = pluralize('slot', slots);
      return (
        <>
          The {props.nameWithNoCompanyNoBrandNoTags} is a large graphics card,
          occupying {slots} PCIe expansion {slotsText}.
        </>
      );
    },
  },
  {
    // GPUs with a slot width that is large.
    tags: [SpecsTag.SlotWidth],
    deps: ['isDualSlot', 'slotWidth'],
    Component: (props) => {
      const slots = Number(props.slotWidth);
      const slotsText = pluralize('slot', slots);
      return (
        <>
          The {props.nameWithNoCompanyNoBrandNoTags} occupies {slots} PCIe
          expansion {slotsText}.
        </>
      );
    },
  },
  {
    // GPUs with a slot width that is large.
    tags: [SpecsTag.SlotWidth],
    deps: ['isLowProfile', 'slotWidth'],
    Component: (props) => {
      const slots = Number(props.slotWidth);
      const slotsText = pluralize('slot', slots);
      return (
        <>
          The {props.nameWithNoCompanyNoBrandNoTags} is a low-profile graphics
          card, occupying only {slots} PCIe expansion {slotsText}.
        </>
      );
    },
  },
  {
    // GPUs with a slot width that is large.
    tags: [SpecsTag.SlotWidth],
    deps: ['isCompactLowProfile', 'slotWidth'],
    Component: (props) => {
      const slots = Number(props.slotWidth);
      const slotsText = pluralize('slot', slots);
      return (
        <>
          The {props.nameWithNoCompanyNoBrandNoTags} is a compact, low-profile
          graphics card that fits into {slots} PCIe expansion {slotsText}.
        </>
      );
    },
  },
);

const CompatibilitySentence2 = compileContentComponent({
  // GPU with output ports
  tags: [SpecsTag.Outputs],
  deps: [],
  Component: (props) => {
    return <>It supports {props.outputs} display connections.</>;
  },
});

const CompatibilitySentence3 = compileContentComponent(
  {
    // TODO: support OR for tags/deps
    // Very Large GPUs with a recommended psu and tdp
    tags: [SpecsTag.SlotWidth, SpecsTag.Tdp, SpecsTag.SuggestedPsu],
    deps: ['isVeryLarge', 'slotWidth', 'tdp', 'suggestedPsu'],
    Component: (props) => {
      return (
        <>
          With a thermal design power (TDP) of {props.tdp} and a massive{' '}
          {props.slotWidth}
          -slot size, it is recommended to use a power supply of{' '}
          {props.suggestedPsu} and a case with sufficient space to accommodate
          the card. Compare your model and case&apos;s dimensions to verify
          compatibility.
        </>
      );
    },
  },
  {
    // Large GPUs with a recommended psu and tdp
    tags: [SpecsTag.SlotWidth, SpecsTag.Tdp, SpecsTag.SuggestedPsu],
    deps: ['isLarge', 'slotWidth', 'tdp', 'suggestedPsu'],
    Component: (props) => {
      return (
        <>
          With a thermal design power (TDP) of {props.tdp} and a large,{' '}
          {props.slotWidth}
          -slot size, it is recommended to use a power supply of{' '}
          {props.suggestedPsu} and a case with sufficient space to accommodate
          the card. Compare your card&apos;s model and your case&apos;s
          dimensions to verify compatibility.
        </>
      );
    },
  },
  {
    // GPUs with a recommended psu and tdp
    tags: [SpecsTag.Tdp, SpecsTag.SuggestedPsu],
    deps: ['tdp', 'suggestedPsu'],
    Component: (props) => {
      return (
        <>
          {props.company} recommends a power supply of at least{' '}
          {props.suggestedPsu} to handle the GPU&apos;s thermal design power
          (TDP) of {props.tdp}.
        </>
      );
    },
  },
  {
    // GPUs with a TDP
    tags: [SpecsTag.Tdp],
    deps: ['tdp'],
    Component: (props) => {
      return (
        <>
          The GPU has a thermal design power (TDP) of {props.tdp}. A power
          supply not strong enough to handle this might result in system crashes
          and potentially damage your hardware.
        </>
      );
    },
  },
  {
    // GPUs with a recommended psu
    tags: [SpecsTag.SuggestedPsu],
    deps: ['suggestedPsu'],
    Component: (props) => {
      return (
        <>
          {props.company} recommends a power supply of at least{' '}
          {props.suggestedPsu} to handle the GPU&apos;s power consumption. Using
          a smaller power supply may result in system crashes and potentially
          damage your hardware.
        </>
      );
    },
  },
);

const CompatibilityParagraph = compileContentComponent(
  {
    tags: [SpecsTag.SlotWidth],
    Component: (props) => (
      <p>
        <CompatibilitySentence1 /> <CompatibilitySentence2 />{' '}
        <CompatibilitySentence3 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.Tdp],
    Component: (props) => (
      <p>
        <CompatibilitySentence1 /> <CompatibilitySentence2 />{' '}
        <CompatibilitySentence3 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.SuggestedPsu],
    Component: (props) => (
      <p>
        <CompatibilitySentence1 /> <CompatibilitySentence2 />{' '}
        <CompatibilitySentence3 />
      </p>
    ),
  },
);

interface CompatibilityBlurbProps {
  index: number;
}

export const CompatibilityBlurb: FunctionComponent<CompatibilityBlurbProps> = (
  props,
) => {
  const { contentTags, contentParams } = useProductContent(props.index);

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <CompatibilityTitle />
      <CompatibilityParagraph />
    </ContentProvider>
  );
};
