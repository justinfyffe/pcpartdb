import React, { FunctionComponent, useContext } from 'react';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from '../../../../../../shared/components';
import { getGpuName } from '../../../../..';
import { ComparePageContext } from '../../../context';
import { FieldRow } from '../../FieldRow';

interface ApiTableProps {
  className?: string;
}

export const ApiTable: FunctionComponent<ApiTableProps> = (props) => {
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
        <FieldRow field="directxVersion" />
        <FieldRow field="openClVersion" />
        <FieldRow field="openGlVersion" />
        <FieldRow field="shaderModelVersion" />
      </TBody>
    </Table>
  );
};
