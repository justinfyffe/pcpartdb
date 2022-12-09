import { Td, Tr } from '@client/shared/components';
import { formatReview, Reviews } from '@shared/review';
import React, { useContext } from 'react';
import { ProductContext } from './product-context';

const LABELS: Record<string, string> = {
  amazon: 'Amazon',
  pcGamer: 'PC Gamer',
  techRadar: 'TechRadar',
  tomsHardware: "Tom's Hardware",
  techSpot: 'TechSpot',
};

interface ReviewRowProps {
  review: keyof Reviews;
}

export const ReviewRow = (props: ReviewRowProps) => {
  const { review: key } = props;

  const context = useContext(ProductContext);
  const review = context.reviews[key];

  return (
    <Tr>
      <Td className="border-r-0 text-left w-[50%]">{LABELS[key]}</Td>
      <Td className="border-l-0 text-left w-[50%]">
        {review?.source != null ? (
          <a href={review.source}>{formatReview(review)}</a>
        ) : (
          <>{formatReview(review) || '--'}</>
        )}
      </Td>
    </Tr>
  );
};
