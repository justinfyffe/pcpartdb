import {
  formatCompanyName,
  getCpuAffiliateUrl,
  productFieldFormattedValue,
  ProductType,
} from '@pcpartdb/shared';
import { ProductCustomRow } from 'packages/website/src/client/product/components/ProductCustomRow/ProductCustomRow';
import { ProductFieldRow } from 'packages/website/src/client/product/components/ProductFieldRow/ProductFieldRow';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
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

  const performanceRank = cpu.ranks.performanceRating ?? null;
  const valueRank = cpu.ranks.performancePerMsrp ?? null;

  const performanceScoreValue = useMemo(() => {
    const performanceScore = productFieldFormattedValue(
      cpu.fields?.performanceRating,
    );

    if (performanceScore != null && performanceRank != null) {
      return `${performanceScore} (${performanceRank})`;
    } else {
      return '--';
    }
  }, [cpu.fields?.performanceRating, performanceRank]);

  const valueScoreValue = useMemo(() => {
    const valueScore = productFieldFormattedValue(
      cpu.fields?.performancePerMsrp,
    );

    if (valueScore != null && valueRank != null) {
      return `${valueScore} (${valueRank})`;
    } else {
      return '--';
    }
  }, [cpu.fields?.performancePerMsrp, valueRank]);

  const cpuAffiliateUrl = useMemo(() => getCpuAffiliateUrl(cpu), [cpu]);

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th>Info</Th>
          <Th>Value</Th>
        </Tr>
      </THead>
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
        <ProductCustomRow
          label="Company"
          values={[formatCompanyName(cpu.company) ?? '--']}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.marketSegment]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.releaseDate]}
        />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.fields?.msrp]} />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.productionStatus]}
        />
      </TBody>
    </Table>
  );
};
