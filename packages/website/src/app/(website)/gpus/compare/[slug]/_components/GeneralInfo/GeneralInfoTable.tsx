import {
  formatCompanyName,
  formatProductName,
  getAffiliateUrl,
  GpuProductComparison,
  ProductType,
} from '@pcpartdb/shared';
import { Table } from 'packages/website/src/app/_common/components/Table/Table';
import { TBody } from 'packages/website/src/app/_common/components/Table/TBody';
import { Th } from 'packages/website/src/app/_common/components/Table/Th';
import { THead } from 'packages/website/src/app/_common/components/Table/THead';
import { Tr } from 'packages/website/src/app/_common/components/Table/Tr';
import { ProductCustomRow } from 'packages/website/src/app/_common/product/components/ProductCustomRow/ProductCustomRow';
import { ProductFieldRow } from 'packages/website/src/app/_common/product/components/ProductFieldRow/ProductFieldRow';
import React, { FunctionComponent } from 'react';

interface GeneralInfoTableProps {
  comparison: GpuProductComparison;
  className?: string;
}

export const GeneralInfoTable: FunctionComponent<GeneralInfoTableProps> = (
  props,
) => {
  const { comparison, className } = props;
  const [gpu1, gpu2] = comparison;

  const [name1, name2] = [
    formatProductName(gpu1, { company: false }),
    formatProductName(gpu2, { company: false }),
  ];

  const gpuAffiliateUrl1 = getAffiliateUrl(gpu1);
  const gpuAffiliateUrl2 = getAffiliateUrl(gpu2);

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th>Info</Th>
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
          label="Company"
          values={[
            formatCompanyName(gpu1.company) ?? '--',
            formatCompanyName(gpu2.company) ?? '--',
          ]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.architecture, gpu2.fields?.architecture]}
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
          fields={[gpu1.fields?.msrp, gpu2.fields?.msrp]}
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
