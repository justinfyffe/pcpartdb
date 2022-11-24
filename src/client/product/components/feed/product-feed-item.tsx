import { Card, Img } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import React, { FunctionComponent } from 'react';

interface ProductFeedItemProps {
  as?: React.ElementType;
  className?: string;
}

export const ProductFeedItem: FunctionComponent<ProductFeedItemProps> = (
  props,
) => {
  return (
    <Card
      className={classNames(
        'flex-1 mx-4 mb-6 max-w-[360px] min-w-[280px]',
        props.className,
      )}
    >
      <Img
        src="https://www.pcgamesn.com/wp-content/sites/pcgamesn/2022/04/Nvidia-RTX-4070-price-release-date-spec-benchmarks-1.jpg"
        width="360"
        height="160"
        className="h-auto m-[-16px_-16px_0] rounded-t rounded-b-none max-h-[160px] w-[calc(100%_+_32px)] max-w-[calc(100%_+_48px)] object-cover"
      />

      <div className="flex flex-col gap-2 text-md">
        <h3 className="font-medium text-xl text-indigo-500">
          <a href="#">RTX 3070 vs RTX 3060</a>
        </h3>
        Is the 3070 better bang for your buck?
      </div>
    </Card>
  );
};
