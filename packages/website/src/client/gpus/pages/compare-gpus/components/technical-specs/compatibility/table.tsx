import React, { FunctionComponent, useContext } from 'react';
import { getGpuName } from '../../../../../../gpus';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from '../../../../../../shared/components';
import { ComparePageContext } from '../../../context';
import { FieldRow } from '../../field-row';

interface CompatibilityTableProps {
  className?: string;
}

export const CompatibilityTable: FunctionComponent<CompatibilityTableProps> = (
  props,
) => {
  const { className } = props;

  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th></Th>
          <Th>{getGpuName(gpu1, { company: false })}</Th>
          <Th>{getGpuName(gpu2, { company: false })}</Th>
        </Tr>
      </THead>
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
