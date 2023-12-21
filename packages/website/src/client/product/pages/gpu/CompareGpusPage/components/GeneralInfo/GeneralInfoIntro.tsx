import { formatProductName } from '@pcpartdb/shared';
import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context/ComparePageContextProvider';

export const GeneralInfoIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      General information about the {props.name1} and {props.name2} like their
      manufacturer, release date, launch price, and production status.
    </>
  ),
});

export const GeneralInfoIntro = () => {
  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  const name1 = useMemo(
    () => formatProductName(gpu1, { company: false }),
    [gpu1],
  );
  const name2 = useMemo(
    () => formatProductName(gpu2, { company: false }),
    [gpu2],
  );

  const context = useMemo(() => ({ params: { name1, name2 } }), [name1, name2]);

  return (
    <ContentContext.Provider value={context}>
      <p className="text-dimmed">
        <GeneralInfoIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
