import {
  formatOrdinalNumber,
  getProductBenchmarkName,
  getProductBenchmarkShortName,
  ProductType,
} from '@pcpartdb/shared';
import React, { FunctionComponent, useMemo } from 'react';
import { DonutChart } from '../../../shared/charts/DonutChart';
import {
  Button,
  ButtonVariant,
} from '../../../shared/components/Button/Button';
import {
  Card,
  CardContent,
  CardTitle,
} from '../../../shared/components/Card/Card';
import { ContentContext } from '../../../shared/content/ContentContext';
import { compileContentComponent } from '../../../shared/content/utils';
import { classNames } from '../../../shared/ui/classNames';
import { usePreferredBenchmark } from '../../../user/hooks/usePreferredBenchmark';
import { usePreferredBenchmarkDialog } from '../../../user/hooks/usePreferredBenchmarkDialog';
import { ProductRatingType } from './types';

export interface CompareProductRatingCardProps {
  ratingType: ProductRatingType;
  productType: ProductType;
  productIds: number[];

  names: [string, string];

  maxRating?: number;
  ratings?: [number, number];

  ranks?: [number, number];
  rankHrefs?: [string, string];

  className?: string;

  onBenchmarkChange?: (viewModel: any) => void;
}

export const CompareProductRatingCard: FunctionComponent<
  CompareProductRatingCardProps
> = (props) => {
  const {
    ratingType,
    productIds,
    productType,
    names,
    ratings,
    ranks,
    rankHrefs,
    maxRating,
    className,
    onBenchmarkChange,
  } = props;
  const preferredBenchmark = usePreferredBenchmark(productType);
  const showPreferredBenchmarkDialog = usePreferredBenchmarkDialog({
    productType,
    softReload: true,
    productIds,
    onChange: onBenchmarkChange,
  });

  const [name1, name2] = names;

  const [rating1, rating2] = ratings;

  const pctDiff1 =
    rating1 && maxRating
      ? `${((rating1 / maxRating) * 100).toFixed(0)}%`
      : null;
  const donutCenterLabel1 = rating1
    ? `${rating1.toLocaleString('en-US', {
        maximumFractionDigits: 2,
      })}`
    : 'N/A';

  const donutCenterLabel2 = rating2
    ? `${rating2.toLocaleString('en-US', {
        maximumFractionDigits: 2,
      })}`
    : 'N/A';
  const pctDiff2 =
    rating2 && maxRating
      ? `${((rating2 / maxRating) * 100).toFixed(0)}%`
      : null;

  const [rank1, rank2] = ranks || [];
  const [rankHref1, rankHref2] = rankHrefs || [];
  const rankFormatted1 = useMemo(() => formatOrdinalNumber(rank1), [rank1]);
  const rankFormatted2 = useMemo(() => formatOrdinalNumber(rank2), [rank2]);

  const contentContext = useMemo(() => {
    const notRated = rating1 == null || rating2 == null;
    const sameRating = !notRated && rating1 === rating2;

    let betterName: string;
    let worseName: string;
    let percentDiff: string;
    if (!notRated && !sameRating) {
      betterName = rating1 > rating2 ? name1 : name2;
      worseName = rating1 > rating2 ? name2 : name1;
      percentDiff = (
        (Math.max(rating1, rating2) / Math.min(rating1, rating2) - 1) *
        100
      ).toLocaleString('en-US', { maximumFractionDigits: 2 });
    }

    return {
      tags: [
        ratingType,
        productType,
        notRated ? 'NOT_RATED' : null,
        sameRating ? 'SAME_RATING' : null,
      ],
      params: {
        name1,
        name2,
        betterName,
        worseName,
        percentDiff,
        preferredBenchmarkName: getProductBenchmarkName(preferredBenchmark),
        preferredBenchmarkShortName:
          getProductBenchmarkShortName(preferredBenchmark),
      },
    };
  }, [
    name1,
    name2,
    preferredBenchmark,
    productType,
    rating1,
    rating2,
    ratingType,
  ]);

  return (
    <ContentContext.Provider value={contentContext}>
      <Card
        className={classNames(
          'flex flex-row justify-between items-stretch flex-wrap gap-4',
          className,
        )}
      >
        <CardTitle as="div" className="grow basis-0 flex flex-col gap-2">
          <span>
            <Title tags={[ratingType]} />
          </span>

          <div className="mb-4">
            <Button
              variant={ButtonVariant.Link}
              className="mr-auto flex flex-col"
              onClick={showPreferredBenchmarkDialog}
            >
              <span className="text-base text-content">
                {getProductBenchmarkName(preferredBenchmark)}
              </span>
              <span className="text-link text-xs">(change benchmark)</span>
            </Button>
          </div>

          <span className="text-base font-normal min-w-50">
            <Description />
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

            <div className="col-start-1 col-end-2 flex flex-1 flex-col gap-1 items-center">
              <div className="flex flex-col gap-1 items-center">
                <DonutChart
                  totalValue={maxRating}
                  centerLabel={donutCenterLabel1}
                  chartClass="w-25 h-25 rounded-full ring-1 ring-white"
                  holeClass="w-[75%] h-[75%] bg-light-shades rounded-full ring-1 ring-white text-lg"
                  data={[{ value: rating1 || 0, color: '#4c5c7c' }]}
                ></DonutChart>

                {pctDiff1 ? (
                  <div className="font-medium whitespace-nowrap">
                    {pctDiff1} of{' '}
                    {maxRating?.toLocaleString('en-US', {
                      maximumFractionDigits: 2,
                    })}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>

            <div className="col-start-2 col-end-3 flex flex-1 flex-col gap-1 items-center">
              <div className="flex flex-col gap-1 items-center">
                <DonutChart
                  totalValue={maxRating}
                  centerLabel={donutCenterLabel2}
                  chartClass="w-25 h-25 rounded-full ring-1 ring-white"
                  holeClass="w-[75%] h-[75%] bg-light-shades rounded-full ring-1 ring-white text-lg"
                  data={[{ value: rating2 || 0, color: '#4c5c7c' }]}
                ></DonutChart>

                {pctDiff2 ? (
                  <div className="font-medium whitespace-nowrap">
                    {pctDiff2} of{' '}
                    {maxRating?.toLocaleString('en-US', {
                      maximumFractionDigits: 2,
                    })}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>

            <div className="col-start-1 col-end-2 flex flex-1 flex-col items-center">
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
            <div className="col-start-2 col-end-3 flex flex-1 flex-col items-center">
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
    </ContentContext.Provider>
  );
};

export const Title = compileContentComponent(
  {
    tags: [ProductRatingType.PerformanceRating],
    component: (_props) => <>Performance</>,
  },
  {
    tags: [ProductRatingType.ValueRating],
    component: (_props) => <>Performance per dollar</>,
  },
);

export const Description = compileContentComponent(
  // Performance
  {
    tags: [ProductRatingType.PerformanceRating],
    deps: ['betterName', 'worseName', 'percentDiff'],
    component: (props) => (
      <p>
        The {props.betterName} has {props.percentDiff}% better performance than
        the {props.worseName}.
      </p>
    ),
  },
  {
    tags: [ProductRatingType.PerformanceRating, 'SAME_RATING'],
    deps: ['name1', 'name2'],
    component: (props) => (
      <p>
        The {props.name1} has a similar performance as the {props.name2}.
      </p>
    ),
  },
  {
    tags: [ProductRatingType.PerformanceRating, 'NOT_RATED'],
    deps: [],
    component: (props) => (
      <p>
        We do not have enough data to compare the benchmark performance of the{' '}
        {props.name1} and {props.name2}.
      </p>
    ),
  },
  // Value
  {
    tags: [ProductRatingType.ValueRating],
    deps: ['betterName', 'worseName', 'percentDiff'],
    component: (props) => (
      <p>
        The {props.betterName} has {props.percentDiff}% better performance per
        dollar (MSRP) than the {props.worseName}.
      </p>
    ),
  },
  {
    tags: [ProductRatingType.ValueRating, 'SAME_RATING'],
    deps: ['name1', 'name2'],
    component: (props) => (
      <p>
        The {props.name1} has a similar performance per dollar as the{' '}
        {props.name2}.
      </p>
    ),
  },
  {
    tags: [ProductRatingType.ValueRating, 'NOT_RATED'],
    deps: ['name1', 'name2'],
    component: (props) => (
      <p>
        We do not have enough data to compare the performance per dollar of the{' '}
        {props.name1} and {props.name2}.
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
