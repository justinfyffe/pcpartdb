import {
  CpuProduct,
  formatCompanyName,
  getAffiliateUrl,
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
  cpu: CpuProduct;
  className?: string;
}

export const GeneralInfoTable: FunctionComponent<GeneralInfoTableProps> = (
  props,
) => {
  const { cpu, className } = props;

  const cpuAffiliateUrl = getAffiliateUrl(cpu);

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th>Info</Th>
          <Th>Value</Th>
        </Tr>
      </THead>
      <TBody>
        <ProductCustomRow
          label="Manufacturer"
          values={[formatCompanyName(cpu.company) ?? '--']}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.generation]}
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
        {cpuAffiliateUrl && (
          <ProductCustomRow
            label="Shop"
            value={
              <a
                href={cpuAffiliateUrl}
                target="_blank"
                rel="noopener nofollow"
                className="underline"
              >
                Check Price
              </a>
            }
          />
        )}
      </TBody>
    </Table>
  );
};
