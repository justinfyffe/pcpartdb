import {
  CpuProductComparison,
  formatCompanyName,
  formatProductName,
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
  comparison: CpuProductComparison;
  className?: string;
}

export const GeneralInfoTable: FunctionComponent<GeneralInfoTableProps> = (
  props,
) => {
  const { comparison, className } = props;
  const [cpu1, cpu2] = comparison;

  const [name1, name2] = [
    formatProductName(cpu1, { company: false }),
    formatProductName(cpu2, { company: false }),
  ];

  const cpuAffiliateUrl1 = getAffiliateUrl(cpu1);
  const cpuAffiliateUrl2 = getAffiliateUrl(cpu2);

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
                    className="underline"
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
                    className="underline"
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
            formatCompanyName(cpu1.company) ?? '--',
            formatCompanyName(cpu2.company) ?? '--',
          ]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.fields?.generation, cpu2.fields?.generation]}
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
