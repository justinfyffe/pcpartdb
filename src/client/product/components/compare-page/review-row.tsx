import { Td, Tr } from '@client/shared/components';
import { formatReview, ReviewKey } from '@shared/review';
import React, { useContext } from 'react';
import { ComparePageContext } from './context';

const LABELS: Record<string, string> = {
  amazon: 'Amazon',
  pcGamer: 'PC Gamer',
  techRadar: 'TechRadar',
  tomsHardware: "Tom's Hardware",
  techSpot: 'TechSpot',
};

interface ReviewRowProps {
  review: ReviewKey;
}

export const ReviewRow = (props: ReviewRowProps) => {
  const { review: key } = props;

  const context = useContext(ComparePageContext);
  const [product1, product2] = context.comparison;
  const review1 = product1.reviews[key];
  const review2 = product2.reviews[key];

  return (
    <Tr>
      <Td className="text-left w-[33%]">{LABELS[key]}</Td>
      <Td className="text-left w-[33%]">
        {review1?.source != null ? (
          <a href={review1.source}>{formatReview(review1)}</a>
        ) : (
          <>{formatReview(review1) || '--'}</>
        )}
      </Td>
      <Td className="text-left w-[33%]">
        {review2?.source != null ? (
          <a href={review2.source}>{formatReview(review2)}</a>
        ) : (
          <>{formatReview(review2) || '--'}</>
        )}
      </Td>
    </Tr>
  );
};
