import {
  formatGpuField,
  formatGpuName,
  getGpuAffiliateUrl,
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
  const [gpu1, gpu2] = comparison;
  const { chipset: parent1 } = gpu1;
  const { chipset: parent2 } = gpu2;

  const [name1, name2] = useMemo(() => {
    return [
      formatGpuName(gpu1, { company: false }),
      formatGpuName(gpu2, { company: false }),
    ];
  }, [gpu1, gpu2]);

  const performanceScoreValues = useMemo(() => {
    const score1 =
      formatGpuField(gpu1.performanceScore) ||
      formatGpuField(parent1?.performanceScore);
    const score2 =
      formatGpuField(gpu2.performanceScore) ||
      formatGpuField(parent2?.performanceScore);
    const rank1 = gpu1.ranks.performanceRank || parent1?.ranks?.performanceRank;
    const rank2 = gpu2.ranks.performanceRank || parent2?.ranks?.performanceRank;

    const formatted1 =
      score1 != null && rank1 != null ? `${score1} (${rank1})` : '--';
    const formatted2 =
      score2 != null && rank2 != null ? `${score2} (${rank2})` : '--';

    return [formatted1, formatted2];
  }, [
    gpu1.performanceScore,
    gpu1.ranks.performanceRank,
    gpu2.performanceScore,
    gpu2.ranks.performanceRank,
    parent1?.performanceScore,
    parent1?.ranks?.performanceRank,
    parent2?.performanceScore,
    parent2?.ranks?.performanceRank,
  ]);

  const valueScoreValues = useMemo(() => {
    const score1 =
      formatGpuField(gpu1.valueScore) || formatGpuField(parent1?.valueScore);
    const score2 =
      formatGpuField(gpu2.valueScore) || formatGpuField(parent2?.valueScore);
    const rank1 = gpu1.ranks.valueRank || parent1?.ranks?.valueRank;
    const rank2 = gpu2.ranks.valueRank || parent2?.ranks?.valueRank;

    const formatted1 =
      score1 != null && rank1 != null ? `${score1} (${rank1})` : '--';
    const formatted2 =
      score2 != null && rank2 != null ? `${score2} (${rank2})` : '--';

    return [formatted1, formatted2];
  }, [
    gpu1.ranks.valueRank,
    gpu1.valueScore,
    gpu2.ranks.valueRank,
    gpu2.valueScore,
    parent1?.ranks?.valueRank,
    parent1?.valueScore,
    parent2?.ranks?.valueRank,
    parent2?.valueScore,
  ]);

  const chipsetValues = useMemo(() => {
    return [formatGpuName(parent1 || gpu1), formatGpuName(parent2 || gpu2)];
  }, [gpu1, gpu2, parent1, parent2]);

  const gpuAffiliateUrl1 = useMemo(() => getGpuAffiliateUrl(gpu1), [gpu1]);
  const gpuAffiliateUrl2 = useMemo(() => getGpuAffiliateUrl(gpu2), [gpu2]);

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
        {(gpuAffiliateUrl1 || gpuAffiliateUrl2) && (
          <ProductCustomRow
            label="Shop"
            values={[
              <>
                {gpuAffiliateUrl1 ? (
                  <a
                    href={gpuAffiliateUrl1}
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
                {gpuAffiliateUrl2 ? (
                  <a
                    href={gpuAffiliateUrl2}
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
        <ProductCustomRow label="Chipset" values={chipsetValues} />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.company, gpu2.company]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.marketSegment, gpu2.marketSegment]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.releaseDate, gpu2.releaseDate]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.launchPrice, gpu2.launchPrice]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.productionStatus, gpu2.productionStatus]}
        />
      </TBody>
    </Table>
  );
};
