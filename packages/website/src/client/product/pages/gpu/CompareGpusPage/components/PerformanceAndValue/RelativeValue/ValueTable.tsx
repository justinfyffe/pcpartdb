import {
  formatProductName,
  getGpuChipset,
  getViewGpuPath,
  GpuProduct,
  hasProductFieldValue,
  productFieldFormattedValue,
  productFieldRawValue,
} from '@pcpartdb/shared';
import { ProductCustomRow } from 'packages/website/src/client/product/components/ProductCustomRow/ProductCustomRow';
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
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ComparePageContext } from '../../../context/ComparePageContext';

interface ValueTableProps {
  className?: string;
}

export const ValueTable: FunctionComponent<ValueTableProps> = (props) => {
  const { className } = props;
  const { comparison, additionalData: contentData } =
    useContext(ComparePageContext);
  const chipset1 = getGpuChipset(comparison[0]);
  const chipset2 = getGpuChipset(comparison[1]);
  const { relativeValueGpus } = contentData;

  const [baselineChipset, setBaselineChipset] = useState(() => {
    return hasProductFieldValue(chipset1.fields?.performancePerMsrp)
      ? chipset1
      : chipset2;
  });
  const [secondaryChipset, setSecondaryChipset] = useState(() => {
    if (
      chipset1.id === chipset2.id ||
      !hasProductFieldValue(chipset1.fields?.performancePerMsrp) ||
      !hasProductFieldValue(chipset2.fields?.performancePerMsrp)
    ) {
      return null;
    } else {
      return chipset2;
    }
  });

  const chipsets = relativeValueGpus;

  useEffect(() => {
    setBaselineChipset(
      hasProductFieldValue(chipset1.fields?.performancePerMsrp)
        ? chipset1
        : chipset2,
    );

    if (
      chipset1.id === chipset2.id ||
      !hasProductFieldValue(chipset1.fields?.performancePerMsrp) ||
      !hasProductFieldValue(chipset2.fields?.performancePerMsrp)
    ) {
      // Same chipset, or one performance is missing.
      setSecondaryChipset(null);
    } else {
      setSecondaryChipset(chipset2);
    }
  }, [chipset1, chipset2]);

  const toggleBaselineChipset = useCallback(
    (chipset: GpuProduct) => {
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
            <Th>GPU</Th>
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
  relativeGpu: GpuProduct;
  baselineGpu: GpuProduct;
  secondaryGpu?: GpuProduct;
}

const ValueTableRow: FunctionComponent<ValueTableRowProps> = (props) => {
  const { baselineGpu, secondaryGpu, relativeGpu } = props;

  const relativeValuePct = useMemo(() => {
    const baseline = productFieldRawValue(
      baselineGpu.fields?.performancePerMsrp,
    );
    const relatedValue = productFieldRawValue(
      relativeGpu.fields?.performancePerMsrp,
    );

    return ((relatedValue / baseline) * 100).toFixed(0);
  }, [
    baselineGpu.fields?.performancePerMsrp,
    relativeGpu.fields?.performancePerMsrp,
  ]);

  const rating = useMemo(
    () => productFieldFormattedValue(relativeGpu.fields?.performancePerMsrp),
    [relativeGpu],
  );

  const href = useMemo(() => getViewGpuPath(relativeGpu), [relativeGpu]);
  const gpuName = useMemo(
    () => formatProductName(relativeGpu, { company: false }),
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
  chipset: GpuProduct;
  active: boolean;
  onClick: () => void;
}

export const BaselineToggle: FunctionComponent<BaselineToggleProps> = (
  props,
) => {
  const { chipset, active, onClick } = props;

  const chipsetName = useMemo(
    () => formatProductName(chipset, { company: false }),
    [chipset],
  );

  if (!hasProductFieldValue(chipset.fields?.performancePerMsrp)) {
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
