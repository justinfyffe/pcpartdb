import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import {
  CpuProductComparison,
  formatProductName,
  getAffiliateUrl,
} from '@pcpartdb/shared';
import { AffiliateDisclaimer } from 'packages/website/src/app/_common/components/AffiliateDisclaimer/AffiliateDisclaimer';
import { AmazonButton } from 'packages/website/src/app/_common/components/Button/AmazonButton';
import React, { FunctionComponent } from 'react';

interface AffiliateHighlightProps {
  comparison: CpuProductComparison;
  className?: string;
}

export const AffiliateHighlight: FunctionComponent<AffiliateHighlightProps> = (
  props,
) => {
  const { comparison } = props;
  const [cpu1, cpu2] = comparison;

  const name1 = formatProductName(cpu1, { company: false, brand: true });
  const name2 = formatProductName(cpu2, { company: false, brand: true });

  const cpuAffiliateUrl1 = getAffiliateUrl(cpu1);
  const cpuAffiliateUrl2 = getAffiliateUrl(cpu2);

  if (!cpuAffiliateUrl1 && !cpuAffiliateUrl2) {
    return <></>;
  }

  return (
    <>
      {cpuAffiliateUrl1 && (
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
                href={cpuAffiliateUrl1}
                target="_blank"
                rel="noopener nofollow"
              >
                Check Price on Amazon
              </AmazonButton>
            </div>
          </div>
          {!cpuAffiliateUrl2 && <AffiliateDisclaimer />}
        </div>
      )}

      {cpuAffiliateUrl2 && (
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
                href={cpuAffiliateUrl2}
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
