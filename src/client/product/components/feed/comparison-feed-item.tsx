import { Card, Img } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import React, { FunctionComponent } from 'react';

interface ComparisonFeedItemProps {
  as?: React.ElementType;
  className?: string;
}

export const ComparisonFeedItem: FunctionComponent<ComparisonFeedItemProps> = (
  props,
) => {
  return (
    <Card
      className={classNames(
        'flex-1 mx-4 mb-6 max-w-[420px] min-w-[280px] cursor-pointer',
        props.className,
      )}
    >
      <div className="relative flex gap-[2px] m-[-16px_-16px_0] rounded-t rounded-b-none h-[160px] w-[calc(100%_+_32px)] max-w-[calc(100%_+_48px)] overflow-hidden border-b">
        <Img
          src="https://www.pcgamesn.com/wp-content/sites/pcgamesn/2022/04/Nvidia-RTX-4070-price-release-date-spec-benchmarks-1.jpg"
          className={classNames(
            'flex-1 h-[160px] object-cover overflow-hidden',
            props.className,
          )}
        />

        <Img
          src="https://i.ebayimg.com/images/g/fPAAAOSwPDNg7qZT/s-l640.jpg"
          className={classNames(
            'flex-1 h-[160px] object-cover overflow-hidden',
            props.className,
          )}
        />

        <div className="flex gap-[46px] w-full h-full absolute items-end justify-center">
          <div className="flex-1 text-[#ececec] font-semibold px-2 text-sm bg-[#558501] border-t border-l border-gray-50 text-center">
            NVIDIA RTX 3070
          </div>
          <div className="flex-1 text-[#ececec] font-semibold px-2 text-sm bg-[#850101] border-t border-r border-gray-50 text-center">
            AMD RTX 3060
          </div>
        </div>

        <div className="flex w-full h-full absolute items-start justify-between rounded-t">
          <div className="text-[#ececec] font-normal px-[6px] py-[2px] text-xs bg-[rgba(51,65,85,1)] border-b border-r border-gray-50 rounded-tl rounded-br">
            $499
          </div>
          <div className="text-[#ececec] font-normal px-[6px] py-[2px] text-xs bg-[rgba(51,65,85,1)]  border-b border-l border-gray-50 rounded-tr rounded-bl">
            $399
          </div>
        </div>

        <div className="flex w-full h-full items-end justify-center absolute">
          <div className="text-[#ececec] font-semibold px-3 text-md rounded-t bg-[rgba(51,65,85,1)] border-2 border-b-0 border-gray-50">
            VS
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-md">
        <h3 className="font-medium text-xl text-indigo-500">
          <a href="#">NVIDIA RTX 3070 vs AMD RTX 3060</a>
        </h3>
        Is the 3070 better bang for your buck?
      </div>
    </Card>
  );
};
