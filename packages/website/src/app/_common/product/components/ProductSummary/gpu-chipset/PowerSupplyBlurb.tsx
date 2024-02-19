'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import React, { FunctionComponent } from 'react';
import { SpecsTag } from '../../../content/buildProductContentTags';
import { useProductContent } from '../../../content/useProductContent';

const PowerSupplyTdp = compileContentComponent({
  tags: [SpecsTag.Tdp],
  component: (props) => <>This graphics card has a TDP of {props.tdp}.</>,
});

const PowerSupplySuggestedPsu = compileContentComponent({
  tags: [SpecsTag.SuggestedPsu],
  component: (props) => (
    <>
      {props.company} recommends using a power supply of at least{' '}
      {props.suggestedPsu} with this card. A power supply lower than this might
      result in system crashes and potentially damage your hardware.
    </>
  ),
});

interface PowerSupplyBlurbProps {}

export const PowerSupplyBlurb: FunctionComponent<PowerSupplyBlurbProps> = (
  _props,
) => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <p>
        <PowerSupplyTdp /> <PowerSupplySuggestedPsu />
      </p>
    </ContentProvider>
  );
};
