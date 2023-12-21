import {
  formatProductName,
  getGpuChipset,
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
  component: (props) => (
    <>
      *The {props.chipsetName1} and {props.chipsetName2}&apos;s performance
      score, performance per dollar, and rankings are based on the{' '}
      {props.preferredBenchmarkName} benchmark and MSRP.
    </>
  ),
});

export const Disclaimer = () => {
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const showPreferredBenchmarkDialog = usePreferredBenchmarkDialog({
    productType: ProductType.Gpu,
    hardReload: true,
  });

  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;
  const [chipset1, chipset2] = [getGpuChipset(gpu1), getGpuChipset(gpu2)];

  const chipsetName1 = useMemo(() => formatProductName(chipset1), [chipset1]);
  const chipsetName2 = useMemo(() => formatProductName(chipset2), [chipset2]);

  const context = useMemo(
    () => ({
      params: {
        chipsetName1,
        chipsetName2,
        preferredBenchmarkName: getProductBenchmarkName(preferredBenchmark),
      },
    }),
    [chipsetName1, chipsetName2, preferredBenchmark],
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
