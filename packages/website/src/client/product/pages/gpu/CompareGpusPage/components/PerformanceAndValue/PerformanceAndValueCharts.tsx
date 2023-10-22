import {
  formatOrdinalNumber,
  formatProductName,
  getGpuChipset,
  productFieldFormattedValue,
  productFieldRawValue,
} from '@pcpartdb/shared';
import { DonutChart } from 'packages/website/src/client/shared/charts/DonutChart';
import {
  Card,
  CardContent,
  CardTitle,
} from 'packages/website/src/client/shared/components/Card/Card';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context/ComparePageContext';

interface PerformanceAndValueChartsProps {
  className?: string;
}

export const PerformanceAndValueCharts: FunctionComponent<
  PerformanceAndValueChartsProps
> = (props) => {
  const { className } = props;
  const { comparison } = useContext(ComparePageContext);
  const chipset1 = getGpuChipset(comparison[0]);
  const chipset2 = getGpuChipset(comparison[1]);

  const performanceRank1 = useMemo(
    () => formatOrdinalNumber(chipset1?.ranks?.performanceRating ?? null),
    [chipset1?.ranks?.performanceRating],
  );
  const valueRank1 = useMemo(
    () => formatOrdinalNumber(chipset1?.ranks?.performancePerMsrp ?? null),
    [chipset1?.ranks?.performancePerMsrp],
  );
  const performanceRank2 = useMemo(
    () => formatOrdinalNumber(chipset2?.ranks?.performanceRating ?? null),
    [chipset2?.ranks?.performanceRating],
  );
  const valueRank2 = useMemo(
    () => formatOrdinalNumber(chipset2?.ranks?.performancePerMsrp ?? null),
    [chipset2?.ranks?.performancePerMsrp],
  );

  const performanceRatingRaw1 = useMemo(() => {
    return productFieldRawValue(chipset1?.fields?.performanceRating);
  }, [chipset1?.fields?.performanceRating]);

  const valueRatingRaw1 = useMemo(() => {
    return productFieldRawValue(chipset1?.fields?.performancePerMsrp);
  }, [chipset1?.fields?.performancePerMsrp]);
  const performanceRatingRaw2 = useMemo(() => {
    return productFieldRawValue(chipset2?.fields?.performanceRating);
  }, [chipset2?.fields?.performanceRating]);

  const valueRatingRaw2 = useMemo(() => {
    return productFieldRawValue(chipset2?.fields?.performancePerMsrp);
  }, [chipset2?.fields?.performancePerMsrp]);

  const performanceRating1 = useMemo(() => {
    const performanceScore = productFieldFormattedValue(
      chipset1.fields?.performanceRating,
    );

    return `${performanceScore || '--'}`;
  }, [chipset1.fields?.performanceRating]);
  const valueRating1 = useMemo(() => {
    const valueScore = productFieldFormattedValue(
      chipset2.fields?.performancePerMsrp,
    );

    return `${valueScore || '--'}`;
  }, [chipset2.fields?.performancePerMsrp]);
  const performanceRating2 = useMemo(() => {
    const performanceScore = productFieldFormattedValue(
      chipset2.fields?.performanceRating,
    );

    return `${performanceScore || '--'}`;
  }, [chipset2.fields?.performanceRating]);
  const valueRating2 = useMemo(() => {
    const valueScore = productFieldFormattedValue(
      chipset2.fields?.performancePerMsrp,
    );

    return `${valueScore || '--'}`;
  }, [chipset2.fields?.performancePerMsrp]);

  const [name1, name2] = useMemo(() => {
    return [
      formatProductName(chipset1, { company: false, brand: false }),
      formatProductName(chipset2, { company: false, brand: false }),
    ];
  }, [chipset1, chipset2]);

  return (
    <div className={classNames('flex flex-col gap-4', className)}>
      {/* TODO: Move to a widget that can be shared between pages */}
      <Card className="flex-1 flex flex-row justify-between items-stretch flex-wrap">
        <CardTitle as="div" className="flex flex-col gap-2 flex-1 min-w-30">
          <span>Performance Rating</span>
          <span className="text-sm font-normal">
            <p>
              This rating indicates that the {name1}{' '}
              {valueRatingRaw1 >= valueRatingRaw2
                ? 'outperforms'
                : 'underperforms'}{' '}
              the {name2} by approximately{' '}
              {((performanceRatingRaw1 / performanceRatingRaw2) * 100).toFixed(
                2,
              )}
              %.
            </p>

            <p>
              Based on a combination of GPU benchmarks. Measured on a scale of
              0-100 with higher ratings indicating better performance.
            </p>
          </span>
        </CardTitle>

        <CardContent className="flex-row items-stretch justify-evenly flex-1 gap-2">
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="text-sm font-medium flex-1 flex items-center text-center">
              {name1}
            </div>
            <DonutChart
              centerLabel={performanceRating1}
              chartClass="w-24 h-24 rounded-full ring-1 ring-white"
              holeClass="w-[75%] h-[75%] bg-light-shades rounded-full ring-1 ring-white"
              data={[
                { name: '', value: performanceRatingRaw1, color: '#4c5c7c' },
                {
                  name: '',
                  value: 100 - performanceRatingRaw1,
                  color: '#aaa',
                },
              ]}
            ></DonutChart>
            <a href="#" className="text-xs text-dimmed font-medium underline">
              {performanceRank1} in GPUs
            </a>
          </div>

          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="text-sm font-medium flex-1 flex items-center text-center">
              {name2}
            </div>
            <DonutChart
              centerLabel={performanceRating2}
              chartClass="w-24 h-24  rounded-full ring-1 ring-white"
              holeClass="w-[75%] h-[75%] bg-light-shades rounded-full ring-1 ring-white"
              data={[
                { name: '', value: performanceRatingRaw2, color: '#4c5c7c' },
                {
                  name: '',
                  value: 100 - performanceRatingRaw2,
                  color: '#aaa',
                },
              ]}
            ></DonutChart>
            <a href="#" className="text-xs text-dimmed font-medium underline">
              {performanceRank2} in GPUs
            </a>
          </div>
        </CardContent>
      </Card>

      {/* TODO: Move to a widget that can be shared between pages */}
      <Card className="flex-1 flex flex-row justify-between items-stretch flex-wrap">
        <CardTitle as="div" className="flex flex-col gap-2 flex-1 min-w-30">
          <span>Value Rating</span>
          <span className="text-sm font-normal">
            <p>
              This rating indicates that the {name1} has approximately{' '}
              {((valueRatingRaw1 / valueRatingRaw2) * 100).toFixed(2)}%{' '}
              {valueRatingRaw1 >= valueRatingRaw2 ? 'better' : 'worse'}{' '}
              performance per dollar than the {name2}.
            </p>

            <p>
              Based on the GPU&apos;s performance per dollar (MSRP). Measured on
              a scale of 0-100 with higher ratings indicating better value.
            </p>
          </span>
        </CardTitle>

        <CardContent className="flex-row items-stretch justify-evenly flex-1 gap-2">
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="text-sm font-medium flex-1 flex items-center text-center">
              {name1}
            </div>
            <DonutChart
              centerLabel={valueRating1}
              chartClass="w-24 h-24 rounded-full ring-1 ring-white"
              holeClass="w-[75%] h-[75%] bg-light-shades rounded-full ring-1 ring-white"
              data={[
                { name: '', value: valueRatingRaw1, color: '#4c5c7c' },
                {
                  name: '',
                  value: 100 - valueRatingRaw1,
                  color: '#aaa',
                },
              ]}
            ></DonutChart>
            <a href="#" className="text-xs text-dimmed font-medium underline">
              {valueRank1} in GPUs
            </a>
          </div>

          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="text-sm font-medium flex-1 flex items-center text-center">
              {name2}
            </div>
            <DonutChart
              centerLabel={valueRating2}
              chartClass="w-24 h-24 rounded-full ring-1 ring-white"
              holeClass="w-[75%] h-[75%] bg-light-shades rounded-full ring-1 ring-white"
              data={[
                { name: '', value: valueRatingRaw2, color: '#4c5c7c' },
                {
                  name: '',
                  value: 100 - valueRatingRaw2,
                  color: '#aaa',
                },
              ]}
            ></DonutChart>
            <a href="#" className="text-xs text-dimmed font-medium underline">
              {valueRank2} in GPUs
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
