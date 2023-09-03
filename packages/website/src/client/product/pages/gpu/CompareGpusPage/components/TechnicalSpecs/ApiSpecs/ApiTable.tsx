import { formatGpuName, ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product/components';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from '../../../../../../../shared/components';
import { ComparePageContext } from '../../../context';

interface ApiTableProps {
  className?: string;
}

export const ApiTable: FunctionComponent<ApiTableProps> = (props) => {
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
          fields={[gpu1.directxVersion, gpu2.directxVersion]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.openClVersion, gpu2.openClVersion]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.openGlVersion, gpu2.openGlVersion]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.shaderModelVersion, gpu2.shaderModelVersion]}
        />
      </TBody>
    </Table>
  );
};
