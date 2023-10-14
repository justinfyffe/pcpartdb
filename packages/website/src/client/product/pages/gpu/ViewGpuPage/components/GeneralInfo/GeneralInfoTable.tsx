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
import { ViewPageContext } from '../../context/ViewPageContext';

interface GeneralInfoTableProps {
  className?: string;
}

export const GeneralInfoTable: FunctionComponent<GeneralInfoTableProps> = (
  props,
) => {
  const { className } = props;
  const { gpu } = useContext(ViewPageContext);
  const { parent } = gpu;

  const performanceRank =
    gpu.ranks.performanceRating ?? parent?.ranks?.performanceRating ?? null;
  const valueRank =
    gpu.ranks.performancePerMsrp ?? parent?.ranks?.performancePerMsrp ?? null;

  const chipset = useMemo(() => {
    return formatProductName(parent || gpu);
  }, [parent, gpu]);

  const performanceScoreValue = useMemo(() => {
    const performanceScore =
      productFieldFormattedValue(gpu.fields?.performanceRating) ||
      productFieldFormattedValue(parent?.fields?.performanceRating);

    if (performanceScore != null && performanceRank != null) {
      return `${performanceScore} (${performanceRank})`;
    } else {
      return '--';
    }
  }, [
    gpu.fields?.performanceRating,
    parent?.fields?.performanceRating,
    performanceRank,
  ]);

  const valueScoreValue = useMemo(() => {
    const valueScore =
      productFieldFormattedValue(gpu.fields?.performancePerMsrp) ||
      productFieldFormattedValue(parent?.fields?.performancePerMsrp);

    if (valueScore != null && valueRank != null) {
      return `${valueScore} (${valueRank})`;
    } else {
      return '--';
    }
  }, [
    gpu.fields?.performancePerMsrp,
    parent?.fields?.performancePerMsrp,
    valueRank,
  ]);

  const gpuAffiliateUrl = useMemo(() => getGpuAffiliateUrl(gpu), [gpu]);

  return (
    <div className={className}>
      <Table border responsive>
        <THead>
          <Tr>
            <Th>Info</Th>
            <Th>Value</Th>
          </Tr>
        </THead>
        <TBody>
          {gpuAffiliateUrl && (
            <ProductCustomRow
              label="Shop"
              value={
                <a
                  href={gpuAffiliateUrl}
                  target="_blank"
                  rel="noopener nofollow"
                >
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
          <ProductCustomRow label="Chipset" values={[chipset]} />
          <ProductCustomRow
            label="Company"
            values={[formatCompanyName(gpu.company) ?? '--']}
          />
          <ProductFieldRow
            type={ProductType.Gpu}
            fields={[gpu.fields?.architecture]}
          />
          <ProductFieldRow
            type={ProductType.Gpu}
            fields={[gpu.fields?.marketSegment]}
          />
          <ProductFieldRow
            type={ProductType.Gpu}
            fields={[gpu.fields?.releaseDate]}
          />
          <ProductFieldRow type={ProductType.Gpu} fields={[gpu.fields?.msrp]} />
          <ProductFieldRow
            type={ProductType.Gpu}
            fields={[gpu.fields?.productionStatus]}
          />
        </TBody>
      </Table>
    </div>
  );
};
