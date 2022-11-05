import { Td, Tr } from '@client/shared/components';
import { formatReview, ReviewKey } from '@shared/review';
import React, { useContext } from 'react';
import { ProductContext } from './product-context';

const LABELS: Record<string, string> = {
  [ReviewKey.Amazon]: 'Amazon',
  [ReviewKey.PcGamer]: 'PC Gamer',
  [ReviewKey.TechRadar]: 'TechRadar',
  [ReviewKey.TomsHardware]: "Tom's Hardware",
  [ReviewKey.TechSpot]: 'TechSpot',
};

interface ReviewRowProps {
  review: ReviewKey;
}

export const ReviewRow = (props: ReviewRowProps) => {
  const { review: key } = props;

  const context = useContext(ProductContext);
  const review = context.reviews[key];

  return (
    <Tr>
      <Td className="border-r-0 text-left">{LABELS[key]}</Td>
      <Td className="border-l-0 text-right">
        {review?.source != null ? (
          <a href={review.source}>{formatReview(review)}</a>
        ) : (
          <>{formatReview(review) || '--'}</>
        )}
      </Td>
    </Tr>
  );
};
