import React, { useContext, useMemo } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { getGpuName, getShoppingUrl } from '../../../..';
import { ViewPageContext } from '../../context';
import { IntroBlurb } from './IntroBlurb';

export const IntroSentence1 = compileContentComponent({
  deps: ['gpuName', 'shoppingUrl'],
  component: (props) => (
    <>
      <a href={props.shoppingUrl as string}>
        View the current availability and price
      </a>{' '}
      for the {props.gpuName}.
    </>
  ),
});

export const IntroSentence2 = compileContentComponent({
  component: () => (
    <>Check below for a comprehensive list of benchmarks and specs.</>
  ),
});

export const IntroSummary = () => {
  const { gpu } = useContext(ViewPageContext);

  const context = useMemo(() => {
    const params = {
      gpuName: getGpuName(gpu),
      shoppingUrl: getShoppingUrl(gpu),
    };

    return { params };
  }, [gpu]);

  return (
    <ContentContext.Provider value={context}>
      <section>
        <IntroBlurb />

        {/* Only show for desktop/workstation gpus? */}
        <h3>
          What are the dimensions for the {getGpuName(gpu, { company: false })}?
        </h3>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Suscipit
          adipiscing bibendum est ultricies integer quis auctor elit. Fermentum
          odio eu feugiat pretium nibh ipsum consequat nisl. Tincidunt dui ut
          ornare lectus sit. Elit pellentesque habitant morbi tristique senectus
          et netus et malesuada. At auctor urna nunc id.
        </p>

        {/* Only show for desktop/workstation gpus? */}
        <h3>
          Which power supply can run the {getGpuName(gpu, { company: false })}?
        </h3>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Suscipit
          adipiscing bibendum est ultricies integer quis auctor elit. Fermentum
          odio eu feugiat pretium nibh ipsum consequat nisl. Tincidunt dui ut
          ornare lectus sit. Elit pellentesque habitant morbi tristique senectus
          et netus et malesuada. At auctor urna nunc id.
        </p>

        <h3>
          How well does the {getGpuName(gpu, { company: false })} perform? Is it
          worth the money?
        </h3>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Suscipit
          adipiscing bibendum est ultricies integer quis auctor elit. Fermentum
          odio eu feugiat pretium nibh ipsum consequat nisl. Tincidunt dui ut
          ornare lectus sit. Elit pellentesque habitant morbi tristique senectus
          et netus et malesuada. At auctor urna nunc id.
        </p>

        <p>
          <IntroSentence1 /> <IntroSentence2 />
        </p>
      </section>
    </ContentContext.Provider>
  );
};
