import { Button, ButtonVariant, Card, Img } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import React, { FunctionComponent } from 'react';

interface FeedItemsProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

interface ProductFeedItemProps {
  as?: React.ElementType;
  className?: string;
}

interface ComparisonFeedItemProps {
  as?: React.ElementType;
  className?: string;
}

export const FeedItems: FunctionComponent<FeedItemsProps> = (props) => {
  const Element = props.as || 'div';

  return (
    <Element
      className={classNames(
        'flex flex-wrap justify-center mx-[-16px]',
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
};

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
        className="h-auto m-[-16px_-16px_0] rounded-t rounded-b-none max-h-[200px] w-[calc(100%_+_32px)] max-w-[calc(100%_+_48px)] object-cover"
      />

      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-xl text-indigo-500">
          <a href="#">RTX 3070 vs RTX 3060</a>
        </h3>
        Is the 3070 better bang for your buck?
      </div>

      <div className="flex justify-end">
        <Button variant={ButtonVariant.Primary}>Compare</Button>
      </div>
    </Card>
  );
};

export const ComparisonFeedItem: FunctionComponent<ComparisonFeedItemProps> = (
  props,
) => {
  return (
    <Card
      className={classNames(
        'flex-1 mx-4 mb-6 max-w-[360px] min-w-[280px]',
        props.className,
      )}
    >
      <div className="relative flex gap-[2px] m-[-16px_-16px_0] rounded-t rounded-b-none h-[200px] w-[calc(100%_+_32px)] max-w-[calc(100%_+_48px)] overflow-hidden">
        <Img
          src="https://preview.redd.it/8siyqldph2x21.jpg?auto=webp&s=eeaa2cdf9c4e01746f4f46cc08c66e5eff77c630"
          className={classNames(
            'h-[200px] object-cover overflow-hidden',
            props.className,
          )}
        />

        <Img
          src="https://preview.redd.it/8siyqldph2x21.jpg?auto=webp&s=eeaa2cdf9c4e01746f4f46cc08c66e5eff77c630"
          className={classNames(
            'h-[200px] object-cover overflow-hidden',
            props.className,
          )}
        />

        <div className="flex gap-4 w-full h-full absolute items-end justify-around pb-6">
          <div className="flex-1 text-[#ececec] font-bold px-1 py-1 text-md bg-[#558501] border-y border-gray-50 text-center">
            RTX 3070
          </div>
          <div className="flex-1 text-[#ececec] font-bold px-1 py-1 text-md bg-[#850101] border-y border-gray-50 text-center">
            RTX 3060
          </div>
        </div>

        <div className="flex w-full h-full absolute items-start justify-between rounded-t">
          <div className="text-[#ececec] font-bold px-2 text-sm bg-[#558501] border-b border-r border-gray-50 rounded-tl">
            NVIDIA
          </div>
          <div className="text-[#ececec] font-bold px-2 text-sm bg-[#850101]  border-b border-l border-gray-50 rounded-tr">
            AMD
          </div>
        </div>

        <div className="flex w-full h-full items-end justify-center absolute pb-[17px]">
          <div className="text-[#ececec] font-bold py-2 px-3 text-xl rounded bg-[rgba(51,65,85,1)] border-2 border-gray-50">
            VS
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-xl text-indigo-500">
          <a href="#">NVIDIA RTX 3070 vs AMD RTX 3060</a>
        </h3>
        Is the 3070 better bang for your buck?
      </div>

      <div className="flex justify-end">
        <Button variant={ButtonVariant.Primary}>Compare</Button>
      </div>
    </Card>
  );
};
