import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { CompareGpusContentTag } from '../../content';
import { ComparePageContext } from '../../context';

const PowerSupplyIntro = compileContentComponent(
  {
    tags: [CompareGpusContentTag.DifferentTdp],
    deps: [],
    component: () => <>These GPUs have a different maximum power draw (TDP).</>,
  },
  {
    tags: [CompareGpusContentTag.SameTdp],
    deps: ['tdp1'],
    // The RTX 2070 and RTX 2080 have the same maximum power draw (TDP) of 750 W.
    component: (props) => (
      <>
        The {props.shortGpuName1} and {props.shortGpuName2} have the same
        maximum power draw (TDP) of {props.tdp1}.
      </>
    ),
  },
);

const PowerSupplyTdp = compileContentComponent({
  tags: [CompareGpusContentTag.DifferentTdp],
  deps: [],
  // The GeForce RTX 2070 has a TDP of 450 W, while the Radeon RX 7900 XTX has a TDP of 355 W.
  component: (props) => (
    <>
      The {props.shortGpuName1} has a TDP of 450 W, while the{' '}
      {props.shortGpuName2} has a TDP of 355 W.
    </>
  ),
});

const PowerSupplyHigherPsuRequirement = compileContentComponent({
  tags: [
    CompareGpusContentTag.DifferentTdp,
    CompareGpusContentTag.DifferentPsu,
  ],
  deps: ['higherPsuGpuName'],
  // This means that the RTX 2070 requires a more powerful power supply (PSU).
  component: (props) => (
    <>
      This means that the {props.higherPsuGpuName} requires a more powerful
      power supply (PSU).
    </>
  ),
});

const PowerSupplySuggestedPsu = compileContentComponent(
  {
    tags: [
      CompareGpusContentTag.DifferentCompany,
      CompareGpusContentTag.DifferentPsu,
    ],
    deps: ['company1', 'company2', 'psu1', 'psu2'],
    // NVIDIA recommends a 750 W PSU for the RTX 2070, while AMD recommends a 850 W PSU for the RX 7900 XTX.
    component: (props) => (
      <>
        {props.company1} recommends a {props.psu1} PSU for the{' '}
        {props.shortestGpuName1}, while {props.company2} recommends a{' '}
        {props.psu2} PSU for the {props.shortestGpuName2}.
      </>
    ),
  },
  {
    tags: [
      CompareGpusContentTag.DifferentCompany,
      CompareGpusContentTag.SamePsu,
    ],
    deps: ['company1', 'company2', 'psu1'],
    // Both NVIDIA and AMD recommend a 750 W PSU for their graphics card.
    component: (props) => (
      <>
        Both {props.company1} and {props.company2} recommend a {props.psu1} PSU
        for their graphics card.
      </>
    ),
  },
  {
    tags: [
      CompareGpusContentTag.SameCompany,
      CompareGpusContentTag.DifferentPsu,
    ],
    deps: ['company1', 'psu1', 'psu2'],
    // NVIDIA recommends a 850 W PSU for the RTX 2080, and a 750 W PSU for the RTX 2070.
    component: (props) => (
      <>
        {props.company1} recommends a {props.psu1} PSU for the{' '}
        {props.shortestGpuName1}, and a {props.psu2} PSU for the{' '}
        {props.shortestGpuName2}.
      </>
    ),
  },
  {
    tags: ['SameCompany', 'SamePsu'],
    deps: ['company1', 'psu1'],
    // NVIDIA recommends a 850 W PSU for both the RTX 2080 and RTX 2070.
    component: (props) => (
      <>
        {props.company1} recommends a {props.psu1} PSU for both the{' '}
        {props.shortestGpuName1} and
        {props.shortestGpuName2}.
      </>
    ),
  },
);

const PowerSupplyParagraph = compileContentComponent({
  tags: [],
  deps: [],
  component: () => (
    <p>
      <PowerSupplyIntro /> <PowerSupplyTdp />{' '}
      <PowerSupplyHigherPsuRequirement /> <PowerSupplySuggestedPsu />
    </p>
  ),
});

export const PowerSupplyBlurb = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <PowerSupplyParagraph />
    </ContentContext.Provider>
  );
};
