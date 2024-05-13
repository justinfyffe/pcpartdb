import {
  formatCompanyName,
  formatProductName,
  getAffiliateUrl,
  GpuProduct,
  ProductType,
} from '@pcpartdb/shared';
import { Table } from 'packages/website/src/app/_common/components/Table/Table';
import { TBody } from 'packages/website/src/app/_common/components/Table/TBody';
import { Th } from 'packages/website/src/app/_common/components/Table/Th';
import { THead } from 'packages/website/src/app/_common/components/Table/THead';
import { Tr } from 'packages/website/src/app/_common/components/Table/Tr';
import { ProductCustomRow } from 'packages/website/src/app/_common/product/components/ProductCustomRow/ProductCustomRow';
import { ProductFieldRow } from 'packages/website/src/app/_common/product/components/ProductFieldRow/ProductFieldRow';
import React from 'react';

interface GeneralInfoTableProps {
  gpu: GpuProduct;
  className?: string;
}

export function GeneralInfoTable(props: GeneralInfoTableProps) {
  const { gpu, className } = props;

  const gpuAffiliateUrl = getAffiliateUrl(gpu);

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
                  className="underline"
                >
                  Check Price
                </a>
              }
            />
          )}
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
}
