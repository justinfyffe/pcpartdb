import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { ViewPageContext } from '../../context';

const PowerSupplyBlurbSentence1 = compileContentComponent({
  deps: ['tdp'],
  component: (props) => (
    <>This GPU has a maximum power consumption of {props.tdp}.</>
  ),
});

const PowerSupplyBlurbSentence2 = compileContentComponent({
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
        <PowerSupplyBlurbSentence1 /> <PowerSupplyBlurbSentence2 />
      </p>
    </ContentContext.Provider>
  );
};
