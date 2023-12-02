import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import {
  ContentParams,
  ContentTags,
} from 'packages/website/src/client/shared/content/types';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { FunctionComponent } from 'react';
import { SpecsTag } from '../../../content/tags';

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

interface PowerSupplyBlurbProps {
  tags?: ContentTags;
  params?: ContentParams;
}

export const PowerSupplyBlurb: FunctionComponent<PowerSupplyBlurbProps> = (
  props,
) => {
  const { tags, params } = props;
  const context = { tags, params };

  return (
    <ContentContext.Provider value={context}>
      <p>
        <PowerSupplyTdp /> <PowerSupplySuggestedPsu />
      </p>
    </ContentContext.Provider>
  );
};
