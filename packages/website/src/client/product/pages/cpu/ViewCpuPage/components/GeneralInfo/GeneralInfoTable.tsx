import {
  formatCpuField,
  getCpuAffiliateUrl,
  ProductType,
} from '@pcpartdb/shared';
import { ProductCustomRow } from 'packages/website/src/client/product/components/ProductCustomRow/ProductCustomRow';
import { ProductFieldRow } from 'packages/website/src/client/product/components/ProductFieldRow/ProductFieldRow';
import {
  Table,
  TBody,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ViewPageContext } from '../../context/ViewPageContext';

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

  const cpuAffiliateUrl = useMemo(() => getCpuAffiliateUrl(cpu), [cpu]);

  return (
    <Table border responsive className={className}>
      <TBody>
        {cpuAffiliateUrl && (
          <ProductCustomRow
            label="Shop"
            value={
              <a href={cpuAffiliateUrl} target="_blank" rel="noopener nofollow">
                Check Price
              </a>
            }
          />
        )}
        <ProductCustomRow
          label="Performance Rating (Rank)*"
          values={[performanceScoreValue]}
        />
        <ProductCustomRow
          label="Performance Per Dollar (Rank)*"
          values={[valueScoreValue]}
        />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.company]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.marketSegment]} />
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
