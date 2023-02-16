import { Table, TBody } from '@client/shared/components';
import React, { FunctionComponent } from 'react';
import { FieldRow } from '../../field-row';

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
        <FieldRow field="slotWidth" />
        <FieldRow field="length" />
        <FieldRow field="width" />
        <FieldRow field="height" />
        <FieldRow field="weight" />
        <FieldRow field="busInterface" />
        <FieldRow field="thermalDesignPower" />
        <FieldRow field="suggestedPsu" />
        <FieldRow field="powerConnectors" />
        <FieldRow field="outputs" />
      </TBody>
    </Table>
  );
};
