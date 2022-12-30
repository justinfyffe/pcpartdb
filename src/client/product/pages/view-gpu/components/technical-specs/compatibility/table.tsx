import { Table, TBody } from '@client/shared/components';
import React, { FunctionComponent } from 'react';
import { SpecRow } from '../../spec-row';

interface CompatibilityTableProps {
  className?: string;
}

export const CompatibilityTable: FunctionComponent<CompatibilityTableProps> = (
  props,
) => {
  const { className } = props;

  return (
    <Table border responsive className={className}>
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
