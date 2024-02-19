import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { CpuProduct, getAffiliateUrl } from '@pcpartdb/shared';
import { AffiliateDisclaimer } from 'packages/website/src/app/_common/components/AffiliateDisclaimer/AffiliateDisclaimer';
import { AmazonButton } from 'packages/website/src/app/_common/components/Button/AmazonButton';
import { ProductHighlight } from 'packages/website/src/app/_common/product/components/ProductHighlight/ProductHighlight';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import React, { FunctionComponent } from 'react';

interface AffiliateHighlightProps {
  cpu: CpuProduct;
  className?: string;
}

export const AffiliateHighlight: FunctionComponent<AffiliateHighlightProps> = (
  props,
) => {
  const { cpu, className } = props;

  const cpuAffiliateUrl = getAffiliateUrl(cpu);

  if (!cpuAffiliateUrl) {
    return <></>;
  }

  return (
    <div className={classNames('flex flex-col', className)}>
      <ProductHighlight
        icon={<ShoppingCartIcon />}
        label="Shop"
        value={
          <AmazonButton
            href={cpuAffiliateUrl}
            target="_blank"
            rel="noopener nofollow"
          >
            Check Price on Amazon
          </AmazonButton>
        }
        className="flex-none"
      />
      {cpuAffiliateUrl && <AffiliateDisclaimer />}
    </div>
  );
};
