import { getGpuName } from '@client/part';
import { Table, TBody, Th, THead, Tr } from '@client/shared/components';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context';
import { SpecRow } from '../../spec-row';

interface CompatibilityTableProps {
  className?: string;
}

export const CompatibilityTable: FunctionComponent<CompatibilityTableProps> = (
  props,
) => {
  const { className } = props;

  const { comparison } = useContext(ComparePageContext);
  const [part1, part2] = comparison;

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th></Th>
          <Th>{getGpuName(part1, { company: false })}</Th>
          <Th>{getGpuName(part2, { company: false })}</Th>
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
