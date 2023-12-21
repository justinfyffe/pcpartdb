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
  Button,
  ButtonVariant,
} from 'packages/website/src/client/shared/components/Button/Button';
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
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ComparePageContext } from '../../../context/ComparePageContextProvider';

interface PerformanceTableProps {
  className?: string;
}

export const PerformanceTable: FunctionComponent<PerformanceTableProps> = (
  props,
) => {
  const { className } = props;
  const { comparison, relativePerformanceGpus } =
    useContext(ComparePageContext);
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const chipset1 = getGpuChipset(comparison[0]);
  const chipset2 = getGpuChipset(comparison[1]);

  const [baselineChipset, setBaselineChipset] = useState(() => {
    return productBenchmarkValue(chipset1, preferredBenchmark)
      ? chipset1
      : chipset2;
  });
  const [secondaryChipset, setSecondaryChipset] = useState(() => {
    if (
      !productBenchmarkValue(chipset1, preferredBenchmark) != null ||
      !productBenchmarkValue(chipset2, preferredBenchmark) != null
    ) {
      return null;
    } else {
      return chipset2;
    }
  });

  const chipsets = relativePerformanceGpus;

  useEffect(() => {
    setBaselineChipset(
      productBenchmarkValue(chipset1, preferredBenchmark) != null
        ? chipset1
        : chipset2,
    );

    if (
      chipset1.id === chipset2.id ||
      productBenchmarkValue(chipset1, preferredBenchmark) == null ||
      productBenchmarkValue(chipset2, preferredBenchmark) == null
    ) {
      // Same chipset, or one performance is missing.
      setSecondaryChipset(null);
    } else {
      setSecondaryChipset(chipset2);
    }
  }, [chipset1, chipset2, preferredBenchmark]);

  const toggleBaselineChipset = useCallback(
    (chipset: GpuProduct) => {
      setSecondaryChipset(baselineChipset);
      setBaselineChipset(chipset);
    },
    [baselineChipset],
  );

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-end">
        <div className="mb-1">
          Baseline:{' '}
          <BaselineToggle
            chipset={chipset1}
            active={baselineChipset?.id === chipset1.id}
            onClick={() => toggleBaselineChipset(chipset1)}
          />{' '}
          {chipset1.id !== chipset2.id && (
            <>
              or{' '}
              <BaselineToggle
                chipset={chipset2}
                active={baselineChipset?.id === chipset2.id}
                onClick={() => toggleBaselineChipset(chipset2)}
              />
            </>
          )}
        </div>
      </div>
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
          {chipsets.map((relativeChipset, i) =>
            relativeChipset != null ? (
              <PerformanceTableRow
                key={relativeChipset.id}
                baselineGpu={baselineChipset}
                secondaryGpu={secondaryChipset}
                relativeGpu={relativeChipset}
              />
            ) : (
              <Tr key={`idx-${i}`}>
                <Td colSpan={3} className="text-center">
                  &#8230;
                </Td>
              </Tr>
            ),
          )}
        </TBody>
      </Table>
    </>
  );
};

interface PerformanceTableRowProps {
  relativeGpu: Partial<GpuProduct>;
  baselineGpu: GpuProduct;
  secondaryGpu?: GpuProduct;
}

const PerformanceTableRow: FunctionComponent<PerformanceTableRowProps> = (
  props,
) => {
  const { baselineGpu, secondaryGpu, relativeGpu } = props;
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);

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
      productBenchmarkValue(relativeGpu, preferredBenchmark).toLocaleString(
        'en-US',
      ),
    [relativeGpu, preferredBenchmark],
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
        secondaryGpu?.id === relativeGpu.id ? 'font-bold !bg-fuchsia-100' : '',
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

interface BaselineToggleProps {
  chipset: GpuProduct;
  active: boolean;
  onClick: () => void;
}

export const BaselineToggle: FunctionComponent<BaselineToggleProps> = (
  props,
) => {
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const { chipset: chipset, active, onClick } = props;

  const chipsetName = useMemo(
    () => formatProductName(chipset, { company: false }),
    [chipset],
  );

  if (productBenchmarkValue(chipset, preferredBenchmark) == null) {
    return (
      <span className="text-dimmed cursor-not-allowed">{chipsetName}</span>
    );
  }

  if (active) {
    return <span className="font-bold">{chipsetName}</span>;
  } else {
    return (
      <Button
        variant={ButtonVariant.Link}
        className="cursor-pointer"
        onClick={onClick}
      >
        {chipsetName}
      </Button>
    );
  }
};
