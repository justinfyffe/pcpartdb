import {
  formatCompanyName,
  formatProductName,
  getAffiliateUrl,
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
import { ViewPageContext } from '../../context/ViewPageContextProvider';

interface GeneralInfoTableProps {
  className?: string;
}

export const GeneralInfoTable: FunctionComponent<GeneralInfoTableProps> = (
  props,
) => {
  const { className } = props;
  const { gpu } = useContext(ViewPageContext);
  const { parent } = gpu;

  const chipset = useMemo(() => {
    return formatProductName(parent || gpu, { company: false });
  }, [parent, gpu]);

  const gpuAffiliateUrl = useMemo(() => getAffiliateUrl(gpu), [gpu]);

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
            label="Company"
            values={[formatCompanyName(gpu.company) ?? '--']}
          />
          <ProductCustomRow label="Chipset" values={[chipset]} />
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
