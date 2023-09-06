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

  const gpuAffiliateUrl = useMemo(() => getGpuAffiliateUrl(gpu), [gpu]);

  return (
    <div className={className}>
      <Table border responsive>
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
          <ProductFieldRow type={ProductType.Gpu} fields={[gpu.company]} />
          <ProductFieldRow type={ProductType.Gpu} fields={[gpu.architecture]} />
          <ProductFieldRow
            type={ProductType.Gpu}
            fields={[gpu.marketSegment]}
          />
          <ProductFieldRow type={ProductType.Gpu} fields={[gpu.releaseDate]} />
          <ProductFieldRow type={ProductType.Gpu} fields={[gpu.launchPrice]} />
          <ProductFieldRow
            type={ProductType.Gpu}
            fields={[gpu.productionStatus]}
          />
        </TBody>
      </Table>
    </div>
  );
};
