import { ProductType } from '@pcpartdb/shared';
import {
  formatCpuField,
  ProductCustomRow,
  ProductFieldRow,
} from 'packages/website/src/client/product';
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
  const { cpu } = useContext(ViewPageContext);

  const performanceRank = cpu.ranks.performanceRank || null;
  const valueRank = cpu.ranks.valueRank || null;

  const performanceScoreValue = useMemo(() => {
    const performanceScore = formatCpuField(cpu.performanceScore);

    if (performanceScore != null && performanceRank != null) {
      return `${performanceScore} (${performanceRank})`;
    } else {
      return '--';
    }
  }, [cpu.performanceScore, performanceRank]);

  const valueScoreValue = useMemo(() => {
    const valueScore = formatCpuField(cpu.valueScore);

    if (valueScore != null && valueRank != null) {
      return `${valueScore} (${valueRank})`;
    } else {
      return '--';
    }
  }, [cpu.valueScore, valueRank]);

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
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.company]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.marketSegments]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.releaseDate]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.launchPrice]} />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.productionStatus]}
        />
      </TBody>
    </Table>
  );
};
