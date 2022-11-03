import { Td, Tr } from '@client/shared/components';
import { formatReview, ReviewKey } from '@shared/review';
import React, { useContext } from 'react';
import { ProductsContext } from './products-context';

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

  const context = useContext(ProductsContext);
  const review1 = context.reviews[0][key];
  const review2 = context.reviews[1][key];

  return (
    <Tr>
      <Td className="border-r-0 text-left min-w-[180px]">{LABELS[key]}</Td>
      <Td className="border-l-0 text-left min-w-[80px]">
        {review1?.source != null ? (
          <a href={review1.source}>{formatReview(review1)}</a>
        ) : (
          <>{LABELS[key]}</>
        )}
      </Td>
      <Td className="border-l-0 text-left min-w-[80px]">
        {review2?.source != null ? (
          <a href={review2.source}>{formatReview(review2)}</a>
        ) : (
          <>{LABELS[key]}</>
        )}
      </Td>
    </Tr>
  );
};
