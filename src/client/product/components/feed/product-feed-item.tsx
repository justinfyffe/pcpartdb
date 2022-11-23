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
        src="https://preview.redd.it/8siyqldph2x21.jpg?auto=webp&s=eeaa2cdf9c4e01746f4f46cc08c66e5eff77c630"
        width="360"
        height="200"
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
