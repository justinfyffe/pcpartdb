import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { getAffiliateUrl } from '@pcpartdb/shared';
import { ProductHighlight } from 'packages/website/src/client/product/components/ProductHighlight/ProductHighlight';
import { AffiliateDisclaimer } from 'packages/website/src/client/shared/components/AffiliateDisclaimer/AffiliateDisclaimer';
import { AmazonButton } from 'packages/website/src/client/shared/components/Button/AmazonButton';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ViewPageContext } from '../../context/ViewPageContextProvider';

interface AffiliateHighlightProps {
  className?: string;
}

export const AffiliateHighlight: FunctionComponent<AffiliateHighlightProps> = (
  props,
) => {
  const { className } = props;

  const context = useContext(ViewPageContext);
  const gpu = context.gpu;

  const gpuAffiliateUrl = useMemo(() => getAffiliateUrl(gpu), [gpu]);

  if (!gpuAffiliateUrl) {
    return <></>;
  }

  return (
    <div className={classNames('flex flex-col', className)}>
      <ProductHighlight
        icon={<ShoppingCartIcon />}
        label="Shop"
        value={
          <AmazonButton
            href={gpuAffiliateUrl}
            target="_blank"
            rel="noopener nofollow"
          >
            Check Price on Amazon
          </AmazonButton>
        }
        className="flex-none"
      />
      {gpuAffiliateUrl && <AffiliateDisclaimer />}
    </div>
  );
};
