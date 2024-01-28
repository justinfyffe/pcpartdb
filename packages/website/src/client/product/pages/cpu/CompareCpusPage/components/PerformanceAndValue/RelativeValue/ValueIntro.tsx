import {
  formatProductName,
  getProductBenchmarkShortName,
  ProductType,
} from '@pcpartdb/shared';
import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import { usePreferredBenchmark } from 'packages/website/src/client/user/hooks/usePreferredBenchmark';
import React, { useContext, useMemo } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContextProvider';

const ValueIntroParagraph = compileContentComponent({
  component: (props) => (
    <>
      Compare {props.name1} and {props.name2}&apos;s performance per dollar with
      similar CPUs. This provides insight into which CPUs gives the best bang
      for your buck. This data is based on {props.preferredBenchmarkName}{' '}
      benchmark performance and MSRP.
    </>
  ),
});

export const ValueIntro = () => {
  const { comparison } = useContext(ComparePageContext);
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);
  const [cpu1, cpu2] = comparison;

  const name1 = useMemo(
    () => formatProductName(cpu1, { company: false }),
    [cpu1],
  );
  const name2 = useMemo(
    () => formatProductName(cpu2, { company: false }),
    [cpu2],
  );

  const context = useMemo(() => {
    const preferredBenchmarkName =
      getProductBenchmarkShortName(preferredBenchmark);
    return {
      params: { name1, name2, preferredBenchmarkName },
    };
  }, [name1, name2, preferredBenchmark]);

  return (
    <ContentContext.Provider value={context}>
      <p className="text-dimmed">
        <ValueIntroParagraph />
      </p>
    </ContentContext.Provider>
  );
};
