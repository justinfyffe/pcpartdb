import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { ViewPageContext } from '../../context';

const PowerSupplyTdp = compileContentComponent({
  deps: ['tdp'],
  component: (props) => <>This graphics card has a TDP of {props.tdp}.</>,
});

const PowerSupplySuggestedPsu = compileContentComponent({
  deps: ['company', 'psu'],
  component: (props) => (
    <>
      {props.company} recommends using a power supply of at least {props.psu}{' '}
      with this card. A power supply lower than this can result in system
      crashes and potentially damaging your hardware.
    </>
  ),
});

export const PowerSupplyBlurb = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p>
        <PowerSupplyTdp /> <PowerSupplySuggestedPsu />
      </p>
    </ContentContext.Provider>
  );
};
