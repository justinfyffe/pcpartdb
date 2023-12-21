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

export interface ViewProductRatingCardProps {
  productType: ProductType;
  productId: number;

  ratingType: ProductRatingType;
  name: string;

  maxRating?: number;
  rating?: number;

  rank?: number;
  rankHref?: string;

  className?: string;

  onBenchmarkChange?: (viewModel: any) => void;
}

export const ViewProductRatingCard: FunctionComponent<
  ViewProductRatingCardProps
> = (props) => {
  const {
    productType,
    productId,
    ratingType,
    name,
    rating,
    maxRating,
    rank,
    rankHref,
    className,
    onBenchmarkChange,
  } = props;
  const preferredBenchmark = usePreferredBenchmark(productType);
  const showPreferredBenchmarkDialog = usePreferredBenchmarkDialog({
    productType,
    softReload: true,
    productIds: [productId],
    onChange: onBenchmarkChange,
  });

  const notRated = rating == null;
  const rankFormatted = useMemo(() => formatOrdinalNumber(rank), [rank]);

  const contentContext = useMemo(() => {
    return {
      tags: [ratingType, productType, notRated ? 'NOT_RATED' : null],
      params: {
        name,
        preferredBenchmarkName: getProductBenchmarkName(preferredBenchmark),
        preferredBenchmarkShortName:
          getProductBenchmarkShortName(preferredBenchmark),
      },
    };
  }, [name, notRated, preferredBenchmark, productType, ratingType]);

  const donutCenterLabel = rating
    ? `${rating.toLocaleString('en-US', {
        maximumFractionDigits: 2,
      })}`
    : 'N/A';
  const pctDiff =
    rating && maxRating ? `${((rating / maxRating) * 100).toFixed(0)}%` : null;

  return (
    <ContentContext.Provider value={contentContext}>
      <Card
        className={classNames(
          'flex-1 flex flex-row justify-between items-start gap-4',
          className,
        )}
      >
        <CardTitle as="div" className="flex flex-col  gap-2 h-full">
          <span>
            <Title />
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
              <span className="text-link text-2xs">(change benchmark)</span>
            </Button>
          </div>

          <div className="text-base font-normal">
            <Description />
          </div>
        </CardTitle>

        <CardContent className="justify-evenly items-center h-full gap-2">
          <div className="flex flex-col gap-1 items-center">
            <DonutChart
              totalValue={maxRating}
              centerLabel={donutCenterLabel}
              chartClass="w-25 h-25 rounded-full ring-1 ring-white"
              holeClass="w-[75%] h-[75%] bg-light-shades rounded-full ring-1 ring-white text-lg"
              data={[{ value: rating || 0, color: '#4c5c7c' }]}
            ></DonutChart>

            {pctDiff ? (
              <div className="font-medium whitespace-nowrap">
                {pctDiff} of{' '}
                {maxRating?.toLocaleString('en-US', {
                  maximumFractionDigits: 2,
                })}
              </div>
            ) : (
              <></>
            )}
          </div>

          {rank && (
            <div
              className={classNames(
                'text-sm font-medium whitespace-nowrap',
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
    </ContentContext.Provider>
  );
};

export const Title = compileContentComponent(
  {
    tags: [ProductRatingType.PerformanceRating],
    component: (props) => <>Performance</>,
  },
  {
    tags: [ProductRatingType.ValueRating],
    component: (_props) => <>Performance per dollar</>,
  },
);

export const Description = compileContentComponent(
  // Performance
  {
    tags: [ProductRatingType.PerformanceRating, 'NOT_RATED'],
    component: (props) => (
      <>
        We do not have {props.preferredBenchmarkName} benchmark data for the{' '}
        {props.name}.
      </>
    ),
  },
  {
    tags: [ProductRatingType.PerformanceRating, ProductType.Cpu],
    component: (props) => (
      <>
        How the {props.name} compares to the CPU with the highest benchmark
        score.
      </>
    ),
  },
  {
    tags: [ProductRatingType.PerformanceRating, ProductType.Gpu],
    component: (props) => (
      <>
        How the {props.name} compares to the GPU with the highest benchmark
        score.
      </>
    ),
  },
  // Value
  {
    tags: [ProductRatingType.ValueRating, 'NOT_RATED'],
    component: (props) => (
      <>
        We do not have enough data to calculate the performance per dollar
        (MSRP) for the {props.preferredBenchmarkName}.
      </>
    ),
  },
  {
    tags: [ProductRatingType.ValueRating, ProductType.Cpu],
    component: (props) => (
      <>
        How the {props.name} compares to the CPU with the highest benchmark
        performance per dollar (MSRP).
      </>
    ),
  },
  {
    tags: [ProductRatingType.ValueRating, ProductType.Gpu],
    component: (props) => (
      <>
        How the {props.name} compares to the GPU with the highest benchmark
        performance per dollar (MSRP).
      </>
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
