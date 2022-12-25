import { Table, TBody, Th, THead, Tr } from '@client/shared/components';
import { getProductName } from '@shared/product';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context';
import { SpecRow } from '../../../spec-row';

interface CompatibilityTableProps {
  className?: string;
}

export const CompatibilityTable: FunctionComponent<CompatibilityTableProps> = (
  props,
) => {
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
        <SpecRow spec="slotWidth" />
        <SpecRow spec="length" />
        <SpecRow spec="width" />
        <SpecRow spec="height" />
        <SpecRow spec="weight" />
        <SpecRow spec="busInterface" />
        <SpecRow spec="thermalDesignPower" />
        <SpecRow spec="suggestedPsu" />
        <SpecRow spec="powerConnectors" />
        <SpecRow spec="outputs" />
      </TBody>
    </Table>
  );
};
