import { formatGpuName, ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product/components/ProductFieldRow/ProductFieldRow';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContext';

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
      formatGpuName(gpu1, { company: false }),
      formatGpuName(gpu2, { company: false }),
    ];
  }, [gpu1, gpu2]);

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
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.slotWidth, gpu2.slotWidth]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.length, gpu2.length]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.width, gpu2.width]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.height, gpu2.height]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.weight, gpu2.weight]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.busInterface, gpu2.busInterface]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.thermalDesignPower, gpu2.thermalDesignPower]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.suggestedPsu, gpu2.suggestedPsu]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.powerConnectors, gpu2.powerConnectors]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.outputs, gpu2.outputs]}
        />
      </TBody>
    </Table>
  );
};
