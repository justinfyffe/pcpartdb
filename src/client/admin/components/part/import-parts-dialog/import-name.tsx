import { Td, Tr } from '@client/shared/components';
import React, { FunctionComponent, useContext } from 'react';
import { ImportPartsContext } from './import-parts-context';

interface ImportNameProps {}

export const ImportName: FunctionComponent<ImportNameProps> = (_props) => {
  const context = useContext(ImportPartsContext);
  const name = context.name;

  return (
    <Tr className="hover:bg-gray-200">
      <Td>Name</Td>
      <Td>{name}</Td>
    </Tr>
  );
};
