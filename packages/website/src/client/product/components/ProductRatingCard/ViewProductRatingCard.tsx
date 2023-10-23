import {
  formatOrdinalNumber,
  ProductField,
  productFieldFormattedValue,
  productFieldRawValue,
  ProductType,
} from '@pcpartdb/shared';
import React, { FunctionComponent, useMemo } from 'react';
import { DonutChart } from '../../../shared/charts/DonutChart';
import {
  Card,
  CardContent,
  CardTitle,
} from '../../../shared/components/Card/Card';
import { compileContentComponent } from '../../../shared/content/utils';
import { classNames } from '../../../shared/ui/classNames';
import { ProductRatingType } from './types';

export interface ViewProductRatingCardProps {
  productType: ProductType;
  ratingType: ProductRatingType;

  maxRating?: number;
  ratingField?: ProductField<number>;

  rank?: number;
  rankHref?: string;
}

export const ViewProductRatingCard: FunctionComponent<
  ViewProductRatingCardProps
> = (props) => {
  const { productType, ratingType, ratingField, maxRating, rank, rankHref } =
    props;

  const ratingRaw = useMemo(() => {
    return productFieldRawValue(ratingField);
  }, [ratingField]);
  const ratingFormatted = useMemo(() => {
    return productFieldFormattedValue(ratingField);
  }, [ratingField]);

  const rankFormatted = useMemo(() => formatOrdinalNumber(rank), [rank]);

  return (
    <Card className="flex-1 flex flex-row justify-between items-start">
      <CardTitle as="div" className="flex flex-col gap-2">
        <span>
          <Title tags={[ratingType]} />
        </span>
        <div className="text-base font-normal">
          <Description tags={[ratingType, productType]} />
        </div>
      </CardTitle>

      <CardContent className="gap-0 items-center">
        <DonutChart
          totalValue={maxRating}
          centerLabel={ratingRaw ? ratingFormatted : 'N/A'}
          chartClass="w-24 h-24 rounded-full ring-1 ring-white"
          holeClass="w-[75%] h-[75%] bg-light-shades rounded-full ring-1 ring-white"
          data={[{ value: ratingRaw, color: '#4c5c7c' }]}
        ></DonutChart>
        {rank && (
          <div
            className={classNames(
              'text-xs font-medium',
              rankHref ? 'underline' : '',
            )}
          >
            <Ranking
              tags={[productType]}
              params={{
                rank: rankFormatted,
                rankHref: rankHref,
                className: 'text-primary',
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const Title = compileContentComponent(
  {
    tags: [ProductRatingType.PerformanceRating],
    component: (_props) => <>Performance Rating</>,
  },
  {
    tags: [ProductRatingType.ValueRating],
    component: (_props) => <>Value Rating</>,
  },
);

export const Description = compileContentComponent(
  // Performance
  {
    tags: [ProductRatingType.PerformanceRating, ProductType.Cpu],
    component: (_props) => (
      <p>
        Based on a combination of CPU benchmarks. Measured on a scale of 0-100
        with higher being better.
      </p>
    ),
  },
  {
    tags: [ProductRatingType.PerformanceRating, ProductType.Gpu],
    component: (_props) => (
      <p>
        Based on a combination of GPU benchmarks. Measured on a scale of 0-100
        with higher being better.
      </p>
    ),
  },
  // Value
  {
    tags: [ProductRatingType.ValueRating],
    component: (_props) => (
      <p>
        Based on the performance per dollar (MSRP). Measured on a scale of 0-100
        with higher being better.
      </p>
    ),
  },
);

export const Ranking = compileContentComponent(
  {
    deps: ['rank', 'rankHref'],
    tags: [ProductType.Cpu],
    component: (props) => (
      <a href={props.rankHref as string} className={props.className as string}>
        {props.rank} in CPUs
      </a>
    ),
  },
  {
    deps: ['rank'],
    tags: [ProductType.Cpu],
    component: (props) => <>{props.rank} in CPUs</>,
  },
  {
    deps: ['rank', 'rankHref'],
    tags: [ProductType.Gpu],
    component: (props) => (
      <a href={props.rankHref as string} className={props.className as string}>
        {props.rank} in GPUs
      </a>
    ),
  },
  {
    deps: ['rank'],
    tags: [ProductType.Gpu],
    component: (props) => <>{props.rank} in GPUs</>,
  },
);
