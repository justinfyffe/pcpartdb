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

interface ValueTableProps {
  className?: string;
}

export const ValueTable: FunctionComponent<ValueTableProps> = (props) => {
  const { className } = props;
  const { comparison, contentData } = useContext(ComparePageContext);
  const chipset1 = getChipset(comparison[0]);
  const chipset2 = getChipset(comparison[1]);
  const { relativeValueGpus } = contentData;

  const [baselineChipset, setBaselineChipset] = useState(() => {
    if (
      chipset1.valueScore?.value == null &&
      chipset2.valueScore?.value == null
    ) {
      return null;
    } else {
      return chipset1.valueScore?.value != null ? chipset1 : chipset2;
    }
  });
  const [secondaryChipset, setSecondaryChipset] = useState(() => {
    if (
      chipset1.id === chipset2.id ||
      chipset1.valueScore?.value == null ||
      chipset2.valueScore?.value == null
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
    for (let i = 0; i < relativeValueGpus.length; ++i) {
      if (i > 0) {
        const rankDiff =
          relativeValueGpus[i].ranks.valueRank -
          relativeValueGpus[i - 1].ranks.valueRank;

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
      ret.push(relativeValueGpus[i]);
    }
    return ret;
  }, [relativeValueGpus]);

  useEffect(() => {
    if (
      chipset1.valueScore?.value == null &&
      chipset2.valueScore?.value == null
    ) {
      // Both GPUs are missing performances. Nothing to store.
      setBaselineChipset(null);
    } else {
      setBaselineChipset(
        chipset1.valueScore?.value != null ? chipset1 : chipset2,
      );
    }

    if (
      chipset1.id === chipset2.id ||
      chipset1.valueScore?.value == null ||
      chipset2.valueScore?.value == null
    ) {
      // Same chipset, or one performance is missing.
      setSecondaryChipset(null);
    } else {
      setSecondaryChipset(chipset2);
    }
  }, [chipset1, chipset2]);

  const getRelativeValue = useCallback(
    (relatedChipset: Gpu) => {
      const baseline = baselineChipset?.valueScore.value;
      const relatedValue = relatedChipset.valueScore.value;

      return ((relatedValue / baseline) * 100).toFixed(0);
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
      <div className="mb-1 text-right">
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
      <Table border responsive className={className}>
        <THead>
          <Tr>
            <Th></Th>
            <Th className="text-right">Performance Per Dollar</Th>
            <Th className="text-right">Relative Value</Th>
          </Tr>
        </THead>
        <TBody>
          {chipsets.map((gpu, i) =>
            gpu != null ? (
              <CustomRow
                key={gpu.id}
                highlight={gpu.id === baselineChipset?.id}
                secondary={gpu.id === secondaryChipset?.id}
              >
                <CustomRowLabel>
                  <a href={getViewGpuPath(gpu)}>
                    {getGpuName(gpu, { company: false })}
                  </a>
                </CustomRowLabel>
                <CustomRowValue className="text-right">
                  {formatGpuField(gpu.valueScore)}
                </CustomRowValue>
                <CustomRowValue className="text-right">
                  {getRelativeValue(gpu)}%
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
  const { chipset, active, onClick } = props;

  const chipsetName = useMemo(
    () => getGpuName(chipset, { company: false }),
    [chipset],
  );

  if (chipset.valueScore?.value == null) {
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
      <a className="cursor-pointer" onClick={onClick}>
        {chipsetName}
      </a>
    );
  }
};
