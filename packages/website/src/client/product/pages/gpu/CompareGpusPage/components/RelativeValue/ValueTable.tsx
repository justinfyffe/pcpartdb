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

interface ValueTableProps {
  className?: string;
}

export const ValueTable: FunctionComponent<ValueTableProps> = (props) => {
  const { className } = props;
  const { comparison, contentData } = useContext(ComparePageContext);
  const chipset1 = getGpuChipset(comparison[0]);
  const chipset2 = getGpuChipset(comparison[1]);
  const { relativeValueGpus } = contentData;

  const [baselineChipset, setBaselineChipset] = useState(() => {
    return hasProductFieldValue(chipset1.valueScore) ? chipset1 : chipset2;
  });
  const [secondaryChipset, setSecondaryChipset] = useState(() => {
    if (
      chipset1.id === chipset2.id ||
      !hasProductFieldValue(chipset1.valueScore) ||
      !hasProductFieldValue(chipset2.valueScore)
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
    setBaselineChipset(
      hasProductFieldValue(chipset1.valueScore) ? chipset1 : chipset2,
    );

    if (
      chipset1.id === chipset2.id ||
      !hasProductFieldValue(chipset1.valueScore) ||
      !hasProductFieldValue(chipset2.valueScore)
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
          {chipsets.map((relativeChipset, i) =>
            relativeChipset != null ? (
              <ValueTableRow
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

interface ValueTableRowProps {
  relativeGpu: Gpu;
  baselineGpu: Gpu;
  secondaryGpu?: Gpu;
}

const ValueTableRow: FunctionComponent<ValueTableRowProps> = (props) => {
  const { baselineGpu, secondaryGpu, relativeGpu } = props;

  const relativeValuePct = useMemo(() => {
    const baseline = baselineGpu.valueScore.value;
    const relatedValue = relativeGpu.valueScore.value;

    return ((relatedValue / baseline) * 100).toFixed(0);
  }, [baselineGpu.valueScore.value, relativeGpu.valueScore.value]);

  const rating = useMemo(
    () => formatGpuField(relativeGpu.valueScore),
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
      values={[rating, `${relativeValuePct}%`]}
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
  const { chipset, active, onClick } = props;

  const chipsetName = useMemo(
    () => formatGpuName(chipset, { company: false }),
    [chipset],
  );

  if (!hasProductFieldValue(chipset.valueScore)) {
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
