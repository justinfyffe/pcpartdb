import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { getAffiliateUrl, GpuProduct } from '@pcpartdb/shared';
import { AffiliateDisclaimer } from 'packages/website/src/app/_common/components/AffiliateDisclaimer/AffiliateDisclaimer';
import { AmazonButton } from 'packages/website/src/app/_common/components/Button/AmazonButton';
import { ProductHighlight } from 'packages/website/src/app/_common/product/components/ProductHighlight/ProductHighlight';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import React from 'react';

interface AffiliateHighlightProps {
  gpu: GpuProduct;
  className?: string;
}

export function AffiliateHighlight(props: AffiliateHighlightProps) {
  const { gpu, className } = props;
  const gpuAffiliateUrl = getAffiliateUrl(gpu);

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
}
