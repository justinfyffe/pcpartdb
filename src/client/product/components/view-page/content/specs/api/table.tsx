import { Table, TBody } from '@client/shared/components';
import React, { FunctionComponent } from 'react';
import { SpecRow } from '../../../spec-row';

interface ApiTableProps {
  className?: string;
}

export const ApiTable: FunctionComponent<ApiTableProps> = (props) => {
  const { className } = props;

  return (
    <Table border responsive className={className}>
      <TBody>
        <SpecRow spec="directXVersion" />
        <SpecRow spec="openClVersion" />
        <SpecRow spec="openGlVersion" />
        <SpecRow spec="shaderModelVersion" />
      </TBody>
    </Table>
  );
};
