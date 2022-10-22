import { Td, Tr } from '@client/shared/components';
import { formatProductReview, ProductReviewKey } from '@shared/product-review';
import React, { useContext } from 'react';
import { ProductContext } from '../product-context';

const LABELS: Record<string, string> = {
  [ProductReviewKey.Amazon]: 'Amazon',
  [ProductReviewKey.PcGamer]: 'PC Gamer',
  [ProductReviewKey.TechRadar]: 'TechRadar',
  [ProductReviewKey.TomsHardware]: "Tom's Hardware",
  [ProductReviewKey.TechSpot]: 'TechSpot',
};

interface ReviewRowProps {
  review: ProductReviewKey;
}

export const ReviewRow = (props: ReviewRowProps) => {
  const { review: key } = props;

  const context = useContext(ProductContext);
  const review = context.reviews[key];

  return (
    <Tr>
      <Td className="border-r-0 text-left">
        {review?.source != null ? (
          <a href={review.source}>{LABELS[key]}</a>
        ) : (
          <>{LABELS[key]}</>
        )}
      </Td>
      <Td className="border-l-0 text-right">{formatProductReview(review)}</Td>
    </Tr>
  );
};
