import {
  formatProductName,
  getProductBenchmarkName,
  ProductType,
} from '@pcpartdb/shared';
import {
  Button,
  ButtonVariant,
} from 'packages/website/src/client/shared/components/Button/Button';
import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import { usePreferredBenchmark } from 'packages/website/src/client/user/hooks/usePreferredBenchmark';
import { usePreferredBenchmarkDialog } from 'packages/website/src/client/user/hooks/usePreferredBenchmarkDialog';
import React, { useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context/ComparePageContextProvider';

const RatingDisclaimer = compileContentComponent({
  tags: [],
  deps: [],
  component: (props) => (
    <>
      *The {props.name1} and {props.name2}&apos;s performance score, performance
      per dollar, and rankings are based on the {props.preferredBenchmarkName}{' '}
      benchmark and MSRP.
    </>
  ),
});

export const Disclaimer = () => {
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);
  const showPreferredBenchmarkDialog = usePreferredBenchmarkDialog({
    productType: ProductType.Cpu,
    hardReload: true,
  });

  const { comparison } = useContext(ComparePageContext);
  const [cpu1, cpu2] = comparison;

  const name1 = useMemo(() => formatProductName(cpu1), [cpu1]);
  const name2 = useMemo(() => formatProductName(cpu2), [cpu2]);

  const context = useMemo(
    () => ({
      params: {
        name1,
        name2,
        preferredBenchmarkName: getProductBenchmarkName(preferredBenchmark),
      },
    }),
    [name1, name2, preferredBenchmark],
  );

  return (
    <ContentContext.Provider value={context}>
      <p className="text-dimmed">
        <RatingDisclaimer />{' '}
        <Button
          variant={ButtonVariant.Link}
          onClick={showPreferredBenchmarkDialog}
        >
          Click here to change your preferred benchmark.
        </Button>
      </p>
    </ContentContext.Provider>
  );
};
