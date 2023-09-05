import {
  formatCpuField,
  formatCpuName,
  getCpuAffiliateUrl,
  ProductType,
} from '@pcpartdb/shared';
import { ProductCustomRow } from 'packages/website/src/client/product/components/ProductCustomRow/ProductCustomRow';
import { ProductFieldRow } from 'packages/website/src/client/product/components/ProductFieldRow/ProductFieldRow';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from '../../../../../../shared/components';
import { ComparePageContext } from '../../context';

interface GeneralInfoTableProps {
  className?: string;
}

export const GeneralInfoTable: FunctionComponent<GeneralInfoTableProps> = (
  props,
) => {
  const { className } = props;
  const { comparison } = useContext(ComparePageContext);
  const [cpu1, cpu2] = comparison;

  const [name1, name2] = useMemo(() => {
    return [
      formatCpuName(cpu1, { company: false }),
      formatCpuName(cpu2, { company: false }),
    ];
  }, [cpu1, cpu2]);

  const performanceScoreValues = useMemo(() => {
    const score1 = formatCpuField(cpu1.performanceScore);
    const score2 = formatCpuField(cpu2.performanceScore);
    const rank1 = cpu1.ranks.performanceRank || null;
    const rank2 = cpu2.ranks.performanceRank || null;

    return [
      score1 != null && rank1 != null ? `${score1} (${rank1})` : '--',
      score2 != null && rank2 != null ? `${score2} (${rank2})` : '--',
    ];
  }, [
    cpu1.performanceScore,
    cpu1.ranks.performanceRank,
    cpu2.performanceScore,
    cpu2.ranks.performanceRank,
  ]);

  const valueScoreValues = useMemo(() => {
    const score1 = formatCpuField(cpu1.valueScore);
    const score2 = formatCpuField(cpu2.valueScore);
    const rank1 = cpu1.ranks.valueRank || null;
    const rank2 = cpu2.ranks.valueRank || null;

    return [
      score1 != null && rank1 != null ? `${score1} (${rank1})` : '--',
      score2 != null && rank2 != null ? `${score2} (${rank2})` : '--',
    ];
  }, [
    cpu1.ranks.valueRank,
    cpu1.valueScore,
    cpu2.ranks.valueRank,
    cpu2.valueScore,
  ]);

  const cpuAffiliateUrl1 = useMemo(() => getCpuAffiliateUrl(cpu1), [cpu1]);
  const cpuAffiliateUrl2 = useMemo(() => getCpuAffiliateUrl(cpu2), [cpu2]);

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th></Th>
          <Th>{name1}</Th>
          <Th>{name2}</Th>
        </Tr>
      </THead>
      <TBody>
        {(cpuAffiliateUrl1 || cpuAffiliateUrl2) && (
          <ProductCustomRow
            label="Shop"
            values={[
              <>
                {cpuAffiliateUrl1 ? (
                  <a
                    href={cpuAffiliateUrl1}
                    target="_blank"
                    rel="noopener nofollow"
                  >
                    Check Price
                  </a>
                ) : (
                  <>N/A</>
                )}
              </>,
              <>
                {cpuAffiliateUrl2 ? (
                  <a
                    href={cpuAffiliateUrl2}
                    target="_blank"
                    rel="noopener nofollow"
                  >
                    Check Price
                  </a>
                ) : (
                  <>N/A</>
                )}
              </>,
            ]}
          />
        )}
        <ProductCustomRow
          label="Performance Rating (Rank)*"
          values={performanceScoreValues}
        />
        <ProductCustomRow
          label="Performance Per Dollar (Rank)*"
          values={valueScoreValues}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.company, cpu2.company]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.marketSegment, cpu2.marketSegment]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.releaseDate, cpu2.releaseDate]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.launchPrice, cpu2.launchPrice]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.productionStatus, cpu2.productionStatus]}
        />
      </TBody>
    </Table>
  );
};
