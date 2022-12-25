import { Table, TBody, Th, THead, Tr } from '@client/shared/components';
import { getProductName } from '@shared/product';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context';
import { SpecRow } from '../../../spec-row';

interface ApiTableProps {
  className?: string;
}

export const ApiTable: FunctionComponent<ApiTableProps> = (props) => {
  const { className } = props;

  const { comparison } = useContext(ComparePageContext);
  const [product1, product2] = comparison;

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th></Th>
          <Th>{getProductName(product1, { company: false })}</Th>
          <Th>{getProductName(product2, { company: false })}</Th>
        </Tr>
      </THead>
      <TBody>
        <SpecRow spec="directXVersion" />
        <SpecRow spec="openClVersion" />
        <SpecRow spec="openGlVersion" />
        <SpecRow spec="shaderModelVersion" />
      </TBody>
    </Table>
  );
};
