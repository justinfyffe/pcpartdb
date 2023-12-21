import {
  formatProductName,
  getGpuChipset,
  getProductPerformanceRank,
  getViewGpuPath,
  GpuProduct,
  productBenchmarkValue,
  ProductType,
} from '@pcpartdb/shared';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import { usePreferredBenchmark } from 'packages/website/src/client/user/hooks/usePreferredBenchmark';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContextProvider';

interface PerformanceTableProps {
  className?: string;
}

export const PerformanceTable: FunctionComponent<PerformanceTableProps> = (
  props,
) => {
  const { className } = props;
  const { gpu, relativePerformanceGpus } = useContext(ViewPageContext);

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th className="text-center">Rank</Th>
          <Th>GPU</Th>
          <Th className="text-right">Performance</Th>
          <Th className="text-right">Relative Performance</Th>
        </Tr>
      </THead>
      <TBody>
        {relativePerformanceGpus.map((relativeGpu) => (
          <PerformanceTableRow
            key={relativeGpu.id}
            baselineGpu={getGpuChipset(gpu)}
            relativeGpu={relativeGpu}
          />
        ))}
      </TBody>
    </Table>
  );
};

interface PerformanceTableRowProps {
  baselineGpu: GpuProduct;
  relativeGpu: Partial<GpuProduct>;
}

const PerformanceTableRow: FunctionComponent<PerformanceTableRowProps> = (
  props,
) => {
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const { baselineGpu, relativeGpu } = props;

  const relativePerformancePct = useMemo(() => {
    const baseline = productBenchmarkValue(baselineGpu, preferredBenchmark);
    const relatedPerformance = productBenchmarkValue(
      relativeGpu,
      preferredBenchmark,
    );

    return Number(
      ((relatedPerformance / baseline) * 100).toFixed(0),
    ).toLocaleString();
  }, [baselineGpu, preferredBenchmark, relativeGpu]);

  const rating = useMemo(
    () =>
      productBenchmarkValue(relativeGpu, preferredBenchmark).toLocaleString(),
    [preferredBenchmark, relativeGpu],
  );

  const rank = useMemo(
    () =>
      getProductPerformanceRank(
        relativeGpu,
        preferredBenchmark,
      ).toLocaleString(),
    [preferredBenchmark, relativeGpu],
  );

  const href = useMemo(() => getViewGpuPath(relativeGpu), [relativeGpu]);
  const gpuName = useMemo(
    () => formatProductName(relativeGpu, { company: false }),
    [relativeGpu],
  );

  return (
    <Tr
      className={classNames(
        baselineGpu.id === relativeGpu.id ? 'font-bold !bg-indigo-100' : '',
      )}
    >
      <Td className="text-center">{rank}</Td>
      <Td className="text-left">
        <a href={href}>{gpuName}</a>
      </Td>
      <Td className="text-right">{rating}</Td>
      <Td className="text-right">{relativePerformancePct}%</Td>
    </Tr>
  );
};
