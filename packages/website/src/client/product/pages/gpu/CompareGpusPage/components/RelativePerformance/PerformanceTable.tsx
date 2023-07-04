import {
  getGpuChipset,
  getViewGpuPath,
  Gpu,
  hasProductFieldValue,
} from '@pcpartdb/shared';
import { ProductCustomRow } from 'packages/website/src/client/product/components';
import {
  formatGpuField,
  formatGpuName,
} from 'packages/website/src/client/product/utils';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Button,
  ButtonVariant,
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '../../../../../../shared/components';
import { ComparePageContext } from '../../context';

interface PerformanceTableProps {
  className?: string;
}

export const PerformanceTable: FunctionComponent<PerformanceTableProps> = (
  props,
) => {
  const { className } = props;
  const { comparison, contentData } = useContext(ComparePageContext);
  const chipset1 = getGpuChipset(comparison[0]);
  const chipset2 = getGpuChipset(comparison[1]);
  const { relativePerformanceGpus } = contentData;

  const [baselineChipset, setBaselineChipset] = useState(() => {
    return hasProductFieldValue(chipset1.performanceScore)
      ? chipset1
      : chipset2;
  });
  const [secondaryChipset, setSecondaryChipset] = useState(() => {
    if (
      !hasProductFieldValue(chipset1.performanceScore) ||
      !hasProductFieldValue(chipset2.performanceScore)
    ) {
      return null;
    } else {
      return chipset2;
    }
  });

  // Add nulls to rank gaps
  const chipsets = useMemo(() => {
    const ret: Gpu[] = [];
    let dontNullGap = false;
    for (let i = 0; i < relativePerformanceGpus.length; ++i) {
      if (i > 0) {
        const rankDiff =
          relativePerformanceGpus[i].ranks.performanceRank -
          relativePerformanceGpus[i - 1].ranks.performanceRank;

        if (rankDiff !== 1) {
          if (rankDiff === 0) {
            dontNullGap = true;
          } else if (dontNullGap) {
            dontNullGap = false;
          } else {
            ret.push(null);
          }
        }
      }
      ret.push(relativePerformanceGpus[i]);
    }
    return ret;
  }, [relativePerformanceGpus]);

  useEffect(() => {
    setBaselineChipset(
      hasProductFieldValue(chipset1.performanceScore) ? chipset1 : chipset2,
    );

    if (
      chipset1.id === chipset2.id ||
      !hasProductFieldValue(chipset1.performanceScore) ||
      !hasProductFieldValue(chipset2.performanceScore)
    ) {
      // Same chipset, or one performance is missing.
      setSecondaryChipset(null);
    } else {
      setSecondaryChipset(chipset2);
    }
  }, [chipset1, chipset2]);

  const toggleBaselineChipset = useCallback(
    (chipset: Gpu) => {
      setSecondaryChipset(baselineChipset);
      setBaselineChipset(chipset);
    },
    [baselineChipset],
  );

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-end">
        {/* <div className="flex flex-wrap gap-2">
          Filter:
          <Checkbox>Desktop</Checkbox>
          <Checkbox>Workstation</Checkbox>
          <Checkbox>Mobile</Checkbox>
          <Checkbox>Integrated</Checkbox>
        </div> */}

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
            <Th></Th>
            <Th className="text-right">Performance Rating</Th>
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
  relativeGpu: Gpu;
  baselineGpu: Gpu;
  secondaryGpu?: Gpu;
}

const PerformanceTableRow: FunctionComponent<PerformanceTableRowProps> = (
  props,
) => {
  const { baselineGpu, secondaryGpu, relativeGpu } = props;

  const relativePerformancePct = useMemo(() => {
    const baseline = baselineGpu.performanceScore.value;
    const relatedPerformance = relativeGpu.performanceScore.value;

    return ((relatedPerformance / baseline) * 100).toFixed(0);
  }, [baselineGpu.performanceScore.value, relativeGpu.performanceScore.value]);

  const rating = useMemo(
    () => formatGpuField(relativeGpu.performanceScore),
    [relativeGpu],
  );

  const href = useMemo(() => getViewGpuPath(relativeGpu), [relativeGpu]);
  const gpuName = useMemo(
    () => formatGpuName(relativeGpu, { company: false }),
    [relativeGpu],
  );

  const highlight = useMemo(() => {
    if (baselineGpu.id === relativeGpu.id) {
      return 'primary';
    } else if (secondaryGpu?.id === relativeGpu.id) {
      return 'secondary';
    } else {
      return null;
    }
  }, [baselineGpu.id, relativeGpu.id, secondaryGpu?.id]);

  return (
    <ProductCustomRow
      label={<a href={href}>{gpuName}</a>}
      values={[rating, `${relativePerformancePct}%`]}
      highlight={highlight}
      valueClassName="text-right"
    />
  );
};

interface BaselineToggleProps {
  chipset: Gpu;
  active: boolean;
  onClick: () => void;
}

export const BaselineToggle: FunctionComponent<BaselineToggleProps> = (
  props,
) => {
  const { chipset: chipset, active, onClick } = props;

  const chipsetName = useMemo(
    () => formatGpuName(chipset, { company: false }),
    [chipset],
  );

  if (!hasProductFieldValue(chipset.performanceScore)) {
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
