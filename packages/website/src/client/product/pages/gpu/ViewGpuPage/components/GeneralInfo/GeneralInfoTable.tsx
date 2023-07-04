import { ProductType } from '@pcpartdb/shared';
import {
  ProductCustomRow,
  ProductFieldRow,
} from 'packages/website/src/client/product/components';
import {
  formatGpuField,
  formatGpuName,
} from 'packages/website/src/client/product/utils';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { Table, TBody } from '../../../../../../shared/components';
import { ViewPageContext } from '../../context';

interface GeneralInfoTableProps {
  className?: string;
}

export const GeneralInfoTable: FunctionComponent<GeneralInfoTableProps> = (
  props,
) => {
  const { className } = props;
  const { gpu } = useContext(ViewPageContext);
  const { chipset: parent } = gpu;

  const performanceRank =
    gpu.ranks.performanceRank || parent?.ranks?.performanceRank || null;
  const valueRank = gpu.ranks.valueRank || parent?.ranks?.valueRank || null;

  const chipset = useMemo(() => {
    return formatGpuName(parent || gpu);
  }, [parent, gpu]);

  const performanceScoreValue = useMemo(() => {
    const performanceScore =
      formatGpuField(gpu.performanceScore) ||
      formatGpuField(parent?.performanceScore);

    if (performanceScore != null && performanceRank != null) {
      return `${performanceScore} (${performanceRank})`;
    } else {
      return '--';
    }
  }, [gpu.performanceScore, parent?.performanceScore, performanceRank]);

  const valueScoreValue = useMemo(() => {
    const valueScore =
      formatGpuField(gpu.valueScore) || formatGpuField(parent?.valueScore);

    if (valueScore != null && valueRank != null) {
      return `${valueScore} (${valueRank})`;
    } else {
      return '--';
    }
  }, [gpu.valueScore, parent?.valueScore, valueRank]);

  return (
    <Table border responsive className={className}>
      <TBody>
        <ProductCustomRow
          label="Performance Rating (Rank)*"
          values={[performanceScoreValue]}
        />
        <ProductCustomRow
          label="Performance Per Dollar (Rank)*"
          values={[valueScoreValue]}
        />
        <ProductCustomRow label="Chipset" values={[chipset]} />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.company]} />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.architecture]} />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.marketSegment]} />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.releaseDate]} />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.launchPrice]} />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.productionStatus]}
        />
      </TBody>
    </Table>
  );
};
