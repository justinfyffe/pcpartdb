import { Td, Tr } from '@client/shared/components';
import React, { FunctionComponent, useContext, useState } from 'react';
import { ImportPartsContext } from './import-parts-context';

interface ImportIdProps {}

export const ImportId: FunctionComponent<ImportIdProps> = (_props) => {
  const context = useContext(ImportPartsContext);
  const [id] = useState(() => context.id);

  return (
    <Tr className="hover:bg-gray-200">
      <Td>ID</Td>
      <Td>{id}</Td>
    </Tr>
  );
};
