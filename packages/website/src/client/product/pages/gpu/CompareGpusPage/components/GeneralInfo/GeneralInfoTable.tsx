import {
  formatCompanyName,
  formatProductName,
  getGpuAffiliateUrl,
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
  const [gpu1, gpu2] = comparison;
  const { parent: parent1 } = gpu1;
  const { parent: parent2 } = gpu2;

  const [name1, name2] = useMemo(() => {
    return [
      formatProductName(gpu1, { company: false }),
      formatProductName(gpu2, { company: false }),
    ];
  }, [gpu1, gpu2]);

  const performanceScoreValues = useMemo(() => {
    const score1 =
      productFieldFormattedValue(gpu1.fields?.performanceRating) ||
      productFieldFormattedValue(parent1?.fields?.performanceRating);
    const score2 =
      productFieldFormattedValue(gpu2.fields?.performanceRating) ||
      productFieldFormattedValue(parent2?.fields?.performanceRating);
    const rank1 =
      gpu1.ranks.performanceRating || parent1?.ranks?.performanceRating;
    const rank2 =
      gpu2.ranks.performanceRating || parent2?.ranks?.performanceRating;

    const formatted1 =
      score1 != null && rank1 != null ? `${score1} (${rank1})` : '--';
    const formatted2 =
      score2 != null && rank2 != null ? `${score2} (${rank2})` : '--';

    return [formatted1, formatted2];
  }, [
    gpu1.fields?.performanceRating,
    gpu1.ranks.performanceRating,
    gpu2.fields?.performanceRating,
    gpu2.ranks.performanceRating,
    parent1?.fields?.performanceRating,
    parent1?.ranks?.performanceRating,
    parent2?.fields?.performanceRating,
    parent2?.ranks?.performanceRating,
  ]);

  const valueScoreValues = useMemo(() => {
    const score1 =
      productFieldFormattedValue(gpu1.fields?.performancePerMsrp) ||
      productFieldFormattedValue(parent1?.fields?.performancePerMsrp);
    const score2 =
      productFieldFormattedValue(gpu2.fields?.performancePerMsrp) ||
      productFieldFormattedValue(parent2?.fields?.performancePerMsrp);
    const rank1 =
      gpu1.ranks.performancePerMsrp || parent1?.ranks?.performancePerMsrp;
    const rank2 =
      gpu2.ranks.performancePerMsrp || parent2?.ranks?.performancePerMsrp;

    const formatted1 =
      score1 != null && rank1 != null ? `${score1} (${rank1})` : '--';
    const formatted2 =
      score2 != null && rank2 != null ? `${score2} (${rank2})` : '--';

    return [formatted1, formatted2];
  }, [
    gpu1.fields?.performancePerMsrp,
    gpu1.ranks.performancePerMsrp,
    gpu2.fields?.performancePerMsrp,
    gpu2.ranks.performancePerMsrp,
    parent1?.fields?.performancePerMsrp,
    parent1?.ranks?.performancePerMsrp,
    parent2?.fields?.performancePerMsrp,
    parent2?.ranks?.performancePerMsrp,
  ]);

  const chipsetValues = useMemo(() => {
    return [
      formatProductName(parent1 || gpu1),
      formatProductName(parent2 || gpu2),
    ];
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
        <ProductCustomRow
          label="Company"
          values={[
            formatCompanyName(gpu1.company) ?? '--',
            formatCompanyName(gpu2.company) ?? '--',
          ]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.marketSegment, gpu2.fields?.marketSegment]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.releaseDate, gpu2.fields?.releaseDate]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.msrp, gpu2.fields?.releaseDate]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[
            gpu1.fields?.productionStatus,
            gpu2.fields?.productionStatus,
          ]}
        />
      </TBody>
    </Table>
  );
};
