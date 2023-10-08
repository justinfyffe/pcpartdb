import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { formatProductName, getGpuAffiliateUrl } from '@pcpartdb/shared';
import { AffiliateDisclaimer } from 'packages/website/src/client/shared/components/AffiliateDisclaimer/AffiliateDisclaimer';
import { WarningButton } from 'packages/website/src/client/shared/components/Button/WarningButton';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context/ComparePageContext';

interface ShopHighlightListItemProps {
  className?: string;
}

export const ShopHighlightListItem: FunctionComponent<
  ShopHighlightListItemProps
> = (_props) => {
  const context = useContext(ComparePageContext);
  const [gpu1, gpu2] = context.comparison;

  const name1 = useMemo(
    () => formatProductName(gpu1, { company: false, brand: true }),
    [gpu1],
  );
  const name2 = useMemo(
    () => formatProductName(gpu2, { company: false, brand: true }),
    [gpu2],
  );

  const gpuAffiliateUrl1 = useMemo(() => getGpuAffiliateUrl(gpu1), [gpu1]);
  const gpuAffiliateUrl2 = useMemo(() => getGpuAffiliateUrl(gpu2), [gpu2]);

  if (!gpuAffiliateUrl1 && !gpuAffiliateUrl2) {
    return <></>;
  }

  return (
    <>
      {gpuAffiliateUrl1 && (
        <div className="flex flex-col">
          <div className="bg-light-shades flex flex-col px-4 py-2 rounded shadow gap-4">
            <div className="flex-1 flex gap-2 items-center mr-auto">
              <div className="mr-1">
                <ShoppingCartIcon className="w-5" />
              </div>

              <div className="font-medium md:text-base text-xl">
                Shop {name1}
              </div>
            </div>

            <div className="flex-1 md:text-base text-content text-right whitespace-nowrap ml-auto">
              <WarningButton
                href={gpuAffiliateUrl1}
                target="_blank"
                rel="noopener nofollow"
              >
                Check Price on Amazon
              </WarningButton>
            </div>
          </div>
          {!gpuAffiliateUrl2 && <AffiliateDisclaimer />}
        </div>
      )}

      {gpuAffiliateUrl2 && (
        <div className="flex flex-col">
          <div className="bg-light-shades flex flex-col px-4 py-2 rounded shadow gap-4">
            <div className="flex-1 flex gap-2 items-center mr-auto">
              <div className="mr-1">
                <ShoppingCartIcon className="w-5" />
              </div>

              <div className="font-medium md:text-base text-xl">
                Shop {name2}
              </div>
            </div>

            <div className="flex-1 md:text-base text-content text-right whitespace-nowrap ml-auto">
              <WarningButton
                href={gpuAffiliateUrl2}
                target="_blank"
                rel="noopener nofollow"
              >
                Check Price on Amazon
              </WarningButton>
            </div>
          </div>
          <AffiliateDisclaimer />
        </div>
      )}
    </>
  );
};
