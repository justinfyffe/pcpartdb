import { ProductType } from '@pcpartdb/shared';
import {
  Button,
  ButtonVariant,
} from 'packages/website/src/client/shared/components/Button/Button';
import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import { usePreferredBenchmarkDialog } from 'packages/website/src/client/user/hooks/usePreferredBenchmarkDialog';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context/ViewPageContextProvider';

const RatingDisclaimer = compileContentComponent({
  component: (props) => (
    <>
      *The {props.cpuName}&apos;s benchmark score, performance per dollar, and
      rankings are based on the {props.preferredBenchmarkName} benchmark and
      MSRP.
    </>
  ),
});

export const Disclaimer = () => {
  const showPreferredBenchmarkDialog = usePreferredBenchmarkDialog({
    productType: ProductType.Cpu,
    hardReload: true,
  });

  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

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
