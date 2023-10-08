import {
  formatCompanyName,
  formatProductName,
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
import { ComparePageContext } from '../../context/ComparePageContext';

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
      formatProductName(cpu1, { company: false }),
      formatProductName(cpu2, { company: false }),
    ];
  }, [cpu1, cpu2]);

  const performanceScoreValues = useMemo(() => {
    const score1 = productFieldFormattedValue(cpu1.fields?.performanceRating);
    const score2 = productFieldFormattedValue(cpu2.fields?.performanceRating);
    const rank1 = cpu1.ranks.performanceRating;
    const rank2 = cpu2.ranks.performanceRating;

    return [
      score1 != null && rank1 != null ? `${score1} (${rank1})` : '--',
      score2 != null && rank2 != null ? `${score2} (${rank2})` : '--',
    ];
  }, [
    cpu1.fields?.performanceRating,
    cpu1.ranks.performanceRating,
    cpu2.fields?.performanceRating,
    cpu2.ranks.performanceRating,
  ]);

  const valueScoreValues = useMemo(() => {
    const score1 = productFieldFormattedValue(cpu1.fields?.performancePerMsrp);
    const score2 = productFieldFormattedValue(cpu2.fields?.performancePerMsrp);
    const rank1 = cpu1.ranks.performancePerMsrp;
    const rank2 = cpu2.ranks.performancePerMsrp;

    return [
      score1 != null && rank1 != null ? `${score1} (${rank1})` : '--',
      score2 != null && rank2 != null ? `${score2} (${rank2})` : '--',
    ];
  }, [
    cpu1.fields?.performancePerMsrp,
    cpu1.ranks.performancePerMsrp,
    cpu2.fields?.performancePerMsrp,
    cpu2.ranks.performancePerMsrp,
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
        <ProductCustomRow
          label="Company"
          values={[
            formatCompanyName(cpu1.company) ?? '--',
            formatCompanyName(cpu2.company) ?? '--',
          ]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.fields?.marketSegment, cpu2.fields?.marketSegment]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.fields?.releaseDate, cpu2.fields?.releaseDate]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.fields?.msrp, cpu2.fields?.msrp]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[
            cpu1.fields?.productionStatus,
            cpu2.fields?.productionStatus,
          ]}
        />
      </TBody>
    </Table>
  );
};
