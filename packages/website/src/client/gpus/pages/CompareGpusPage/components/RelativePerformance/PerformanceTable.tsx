import { getChipset, getViewGpuPath, Gpu } from '@pcpartdb/shared';
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
  Checkbox,
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '../../../../../shared/components';
import { formatGpuField, getGpuName } from '../../../..';
import { ComparePageContext } from '../../context';
import {
  CustomRow,
  CustomRowLabel,
  CustomRowValue,
} from '../CustomRow/CustomRow';

interface PerformanceTableProps {
  className?: string;
}

export const PerformanceTable: FunctionComponent<PerformanceTableProps> = (
  props,
) => {
  const { className } = props;
  const { comparison, contentData } = useContext(ComparePageContext);
  const chipset1 = getChipset(comparison[0]);
  const chipset2 = getChipset(comparison[1]);
  const { relativePerformanceGpus } = contentData;

  const [baselineChipset, setBaselineChipset] = useState(() => {
    if (
      chipset1.performanceScore?.value == null &&
      chipset2.performanceScore?.value == null
    ) {
      return null;
    } else {
      return chipset1.performanceScore?.value != null ? chipset1 : chipset2;
    }
  });
  const [secondaryChipset, setSecondaryChipset] = useState(() => {
    if (
      chipset1.performanceScore?.value == null ||
      chipset2.performanceScore?.value == null
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
    if (
      chipset1.performanceScore?.value == null &&
      chipset2.performanceScore?.value == null
    ) {
      // Both GPUs are missing performances. Nothing to store.
      setBaselineChipset(null);
    } else {
      setBaselineChipset(
        chipset1.performanceScore?.value != null ? chipset1 : chipset2,
      );
    }

    if (
      chipset1.id === chipset2.id ||
      chipset1.performanceScore?.value == null ||
      chipset2.performanceScore?.value == null
    ) {
      // Same chipset, or one performance is missing.
      setSecondaryChipset(null);
    } else {
      setSecondaryChipset(chipset2);
    }
  }, [chipset1, chipset2]);

  const getRelativePerformance = useCallback(
    (relatedChipset: Gpu) => {
      const baseline = baselineChipset.performanceScore.value;
      const relatedPerf = relatedChipset.performanceScore.value;

      return ((relatedPerf / baseline) * 100).toFixed(0);
    },
    [baselineChipset],
  );

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
          {chipsets.map((chipset, i) =>
            chipset != null ? (
              <CustomRow
                key={chipset.id}
                highlight={chipset.id === baselineChipset?.id}
                secondary={chipset.id === secondaryChipset?.id}
              >
                <CustomRowLabel>
                  <a href={getViewGpuPath(chipset)}>
                    {getGpuName(chipset, { company: false })}
                  </a>
                </CustomRowLabel>
                <CustomRowValue className="text-right">
                  {formatGpuField(chipset.performanceScore)}
                </CustomRowValue>
                <CustomRowValue className="text-right">
                  {getRelativePerformance(chipset)}%
                </CustomRowValue>
              </CustomRow>
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
    () => getGpuName(chipset, { company: false }),
    [chipset],
  );

  if (chipset.performanceScore?.value == null) {
    return (
      <span className="text-content-dimmed cursor-not-allowed">
        {chipsetName}
      </span>
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
