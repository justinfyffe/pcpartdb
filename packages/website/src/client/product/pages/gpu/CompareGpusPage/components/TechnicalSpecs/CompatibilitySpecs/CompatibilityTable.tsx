import { formatProductName, ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product/components/ProductFieldRow/ProductFieldRow';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContextProvider';

interface CompatibilityTableProps {
  className?: string;
}

export const CompatibilityTable: FunctionComponent<CompatibilityTableProps> = (
  props,
) => {
  const { className } = props;

  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  const [name1, name2] = useMemo(() => {
    return [
      formatProductName(gpu1, { company: false }),
      formatProductName(gpu2, { company: false }),
    ];
  }, [gpu1, gpu2]);

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th>Spec</Th>
          <Th>{name1}</Th>
          <Th>{name2}</Th>
        </Tr>
      </THead>
      <TBody>
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.slotWidth, gpu2.fields?.slotWidth]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.length, gpu2.fields?.length]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.width, gpu2.fields?.width]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.height, gpu2.fields?.height]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.weight, gpu2.fields?.weight]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.busInterface, gpu2.fields?.busInterface]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.tdp, gpu2.fields?.tdp]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.suggestedPsu, gpu2.fields?.suggestedPsu]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.powerConnectors, gpu2.fields?.powerConnectors]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.outputs, gpu2.fields?.outputs]}
        />
      </TBody>
    </Table>
  );
};
