import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import {
  formatProductName,
  getAffiliateUrl,
  GpuProductComparison,
} from '@pcpartdb/shared';
import { AffiliateDisclaimer } from 'packages/website/src/app/_common/components/AffiliateDisclaimer/AffiliateDisclaimer';
import { AmazonButton } from 'packages/website/src/app/_common/components/Button/AmazonButton';
import React, { FunctionComponent } from 'react';

interface ShopHighlightListItemProps {
  comparison: GpuProductComparison;
  className?: string;
}

export const ShopHighlightListItem: FunctionComponent<
  ShopHighlightListItemProps
> = (props) => {
  const { comparison } = props;
  const [gpu1, gpu2] = comparison;

  const name1 = formatProductName(gpu1, { company: false, brand: true });
  const name2 = formatProductName(gpu2, { company: false, brand: true });

  const gpuAffiliateUrl1 = getAffiliateUrl(gpu1);
  const gpuAffiliateUrl2 = getAffiliateUrl(gpu2);

  if (!gpuAffiliateUrl1 && !gpuAffiliateUrl2) {
    return <></>;
  }

  return (
    <>
      {gpuAffiliateUrl1 && (
        <div className="flex flex-col">
          <div className="bg-light-shades flex flex-row flex-wrap px-4 py-2 rounded shadow gap-4 items-center">
            <div className="flex-1 flex gap-2 items-center mr-auto">
              <div className="mr-1">
                <ShoppingCartIcon className="w-5" />
              </div>

              <div className="font-medium md:text-base text-xl">
                Shop {name1}
              </div>
            </div>

            <div className="flex-none md:text-base text-content text-right whitespace-nowrap ml-auto">
              <AmazonButton
                href={gpuAffiliateUrl1}
                target="_blank"
                rel="noopener nofollow"
              >
                Check Price on Amazon
              </AmazonButton>
            </div>
          </div>
          {!gpuAffiliateUrl2 && <AffiliateDisclaimer />}
        </div>
      )}

      {gpuAffiliateUrl2 && (
        <div className="flex flex-col">
          <div className="bg-light-shades flex flex-row flex-wrap px-4 py-2 rounded shadow gap-4 items-center">
            <div className="flex-1 flex gap-2 items-center mr-auto">
              <div className="mr-1">
                <ShoppingCartIcon className="w-5" />
              </div>

              <div className="font-medium md:text-base text-xl">
                Shop {name2}
              </div>
            </div>

            <div className="flex-none md:text-base text-content text-right whitespace-nowrap ml-auto">
              <AmazonButton
                href={gpuAffiliateUrl2}
                target="_blank"
                rel="noopener nofollow"
              >
                Check Price on Amazon
              </AmazonButton>
            </div>
          </div>
          <AffiliateDisclaimer />
        </div>
      )}
    </>
  );
};
