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

enum BetterWorseSame {
  Better = 'BETTER',
  Worse = 'WORSE',
  Same = 'SAME',
}

export interface CompareProductRatingCardProps {
  ratingType: ProductRatingType;
  productType: ProductType;

  names: [string, string];

  maxRating?: number;
  ratingFields?: [ProductField<number>, ProductField<number>];

  ranks?: [number, number];
  rankHrefs?: [string, string];
}

export const CompareProductRatingCard: FunctionComponent<
  CompareProductRatingCardProps
> = (props) => {
  const {
    ratingType,
    productType,
    names,
    ratingFields,
    ranks,
    rankHrefs,
    maxRating,
  } = props;

  const [name1, name2] = names;

  const [ratingField1, ratingField2] = ratingFields;
  const ratingFormatted1 = useMemo(
    () => productFieldFormattedValue(ratingField1),
    [ratingField1],
  );
  const ratingFormatted2 = useMemo(
    () => productFieldFormattedValue(ratingField2),
    [ratingField2],
  );
  const ratingRaw1 = useMemo(
    () => productFieldRawValue(ratingField1),
    [ratingField1],
  );
  const ratingRaw2 = useMemo(
    () => productFieldRawValue(ratingField2),
    [ratingField2],
  );

  const [rank1, rank2] = ranks || [];
  const [rankHref1, rankHref2] = rankHrefs || [];
  const rankFormatted1 = useMemo(() => formatOrdinalNumber(rank1), [rank1]);
  const rankFormatted2 = useMemo(() => formatOrdinalNumber(rank2), [rank2]);

  const betterWorseSame = useMemo(() => {
    if (ratingRaw1 == null || ratingRaw2 == null) {
      return null;
    }

    if (ratingRaw1 > ratingRaw2) {
      return BetterWorseSame.Better;
    } else if (ratingRaw1 < ratingRaw2) {
      return BetterWorseSame.Worse;
    } else if (ratingRaw1 === ratingRaw2) {
      return BetterWorseSame.Same;
    }
    return null;
  }, [ratingRaw1, ratingRaw2]);
  const percentDiff = useMemo(() => {
    if (ratingRaw1 == null || ratingRaw2 == null) {
      return null;
    }

    if (
      betterWorseSame === BetterWorseSame.Better ||
      betterWorseSame === BetterWorseSame.Worse
    ) {
      return Number(
        Math.abs((ratingRaw1 / ratingRaw2 - 1) * 100).toFixed(0),
      ).toLocaleString();
    }
    return null;
  }, [betterWorseSame, ratingRaw1, ratingRaw2]);

  return (
    <Card className="flex flex-row justify-between items-stretch flex-wrap gap-4">
      <CardTitle as="div" className="grow basis-0 flex flex-col gap-2">
        <span className="whitespace-nowrap">
          <Title tags={[ratingType]} />
        </span>
        <span className="text-base font-normal">
          <Description1
            tags={[ratingType, productType]}
            params={{
              name1,
              name2,
              percentDiff,
            }}
          />
          <Description2
            tags={[ratingType, productType, betterWorseSame]}
            params={{
              name1,
              name2,
              percentDiff,
            }}
          />
        </span>
      </CardTitle>

      <CardContent className="grow basis-0 flex flex-row">
        <div className="flex-1 grid items-stretch justify-items-center justify-evenly gap-x-8 gap-y-2">
          <div className="col-start-1 col-end-2 text-base font-medium flex-1 flex items-center text-center">
            {name1}
          </div>
          <div className="col-start-2 col-end-3 text-base font-medium flex-1 flex items-center text-center">
            {name2}
          </div>

          <div className="col-start-1 col-end-2 flex flex-1 items-center">
            <DonutChart
              totalValue={maxRating}
              centerLabel={ratingRaw1 ? ratingFormatted1 : 'N/A'}
              chartClass="w-24 h-24 rounded-full ring-1 ring-white"
              holeClass="w-[75%] h-[75%] bg-light-shades rounded-full ring-1 ring-white"
              data={[{ value: ratingRaw1, color: '#4c5c7c' }]}
            ></DonutChart>
          </div>
          <div className="col-start-2 col-end-3 flex flex-1 items-center">
            <DonutChart
              totalValue={maxRating}
              centerLabel={ratingRaw2 ? ratingFormatted2 : 'N/A'}
              chartClass="w-24 h-24  rounded-full ring-1 ring-white"
              holeClass="w-[75%] h-[75%] bg-light-shades rounded-full ring-1 ring-white"
              data={[{ value: ratingRaw2, color: '#4c5c7c' }]}
            ></DonutChart>
          </div>

          <div className="col-start-1 col-end-2 flex flex-1 items-center">
            {rank1 && (
              <div
                className={classNames(
                  'text-base font-medium whitespace-nowrap',
                  rankHref1 ? 'underline' : '',
                )}
              >
                <Ranking
                  tags={[productType]}
                  params={{
                    rank: rankFormatted1,
                    rankHref: rankHref1,
                    className: 'text-primary',
                  }}
                />
              </div>
            )}
          </div>
          <div className="col-start-2 col-end-3 flex flex-1 items-center">
            {rank2 && (
              <div
                className={classNames(
                  'text-base font-medium whitespace-nowrap',
                  rankHref1 ? 'underline' : '',
                )}
              >
                <Ranking
                  tags={[productType]}
                  params={{
                    rank: rankFormatted2,
                    rankHref: rankHref2,
                    className: 'text-primary',
                  }}
                />
              </div>
            )}
          </div>
        </div>
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

export const Description1 = compileContentComponent(
  // Performance
  {
    tags: [ProductRatingType.PerformanceRating, ProductType.Cpu],
    component: (_props) => (
      <p>
        This rating is based on a combination of CPU benchmarks. It can have a
        max score of 100. Higher is better.
      </p>
    ),
  },
  {
    tags: [ProductRatingType.PerformanceRating, ProductType.Gpu],
    component: (_props) => (
      <p>
        This rating is based on a combination of GPU benchmarks. It can a max
        score of 100. Higher is better.
      </p>
    ),
  },
  // Value
  {
    tags: [ProductRatingType.ValueRating],
    component: (_props) => (
      <p>
        This rating is based on the performance per dollar (MSRP). It can have a
        max value of 100. Higher is better.
      </p>
    ),
  },
);

export const Description2 = compileContentComponent(
  // Performance
  {
    tags: [ProductRatingType.PerformanceRating, BetterWorseSame.Better],
    deps: ['name1', 'name2', 'percentDiff'],
    component: (props) => (
      <p>
        The {props.name1} has approximately {props.percentDiff}% better
        performance than the {props.name2}.
      </p>
    ),
  },
  {
    tags: [ProductRatingType.PerformanceRating, BetterWorseSame.Worse],
    deps: ['name1', 'name2', 'percentDiff'],
    component: (props) => (
      <p>
        The {props.name1} has approximately {props.percentDiff}% less
        performance than the {props.name2}.
      </p>
    ),
  },
  {
    tags: [ProductRatingType.PerformanceRating, BetterWorseSame.Same],
    deps: ['name1', 'name2'],
    component: (props) => (
      <p>
        The {props.name1} has a similar performance as the {props.name2}.
      </p>
    ),
  },
  {
    tags: [ProductRatingType.PerformanceRating],
    deps: ['name1', 'name2'],
    component: (props) => (
      <p>
        We do not have enough data to compare the performance ratings of{' '}
        {props.name1} and {props.name2}.
      </p>
    ),
  },
  // Value
  {
    tags: [ProductRatingType.ValueRating, BetterWorseSame.Better],
    deps: ['name1', 'name2', 'percentDiff'],
    component: (props) => (
      <p>
        The {props.name1} has approximately {props.percentDiff}% better
        performance per dollar (MSRP) than the {props.name2}.
      </p>
    ),
  },
  {
    tags: [ProductRatingType.ValueRating, BetterWorseSame.Worse],
    deps: ['name1', 'name2', 'percentDiff'],
    component: (props) => (
      <p>
        The {props.name1} has approximately {props.percentDiff}% less
        performance per dollar (MSRP) than the {props.name2}.
      </p>
    ),
  },
  {
    tags: [ProductRatingType.ValueRating, BetterWorseSame.Same],
    deps: ['name1', 'name2'],
    component: (props) => (
      <p>
        The {props.name1} has a similar performance per dollar as the{' '}
        {props.name2}.
      </p>
    ),
  },
  {
    tags: [ProductRatingType.ValueRating],
    deps: ['name1', 'name2'],
    component: (props) => (
      <p>
        We do not have enough data to compare the value ratings of {props.name1}{' '}
        and {props.name2}.
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
