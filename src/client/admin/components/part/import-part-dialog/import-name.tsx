import { Checkbox, Td, Tr } from '@client/shared/components';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useState,
} from 'react';
import { ImportPartContext } from './import-part-context';

interface ImportNameProps {}

export const ImportName: FunctionComponent<ImportNameProps> = (_props) => {
  const context = useContext(ImportPartContext);
  const [name] = useState(() => context.name);
  const [checked, setChecked] = useState(() => name != null);

  const handleClick = useCallback(() => {
    context.name = checked ? null : name;
    setChecked(!checked);
  }, [context, name, checked]);

  return (
    <Tr onClick={handleClick} className="hover:bg-gray-200 cursor-pointer">
      <Td>Name</Td>
      <Td>{name}</Td>
      <Td className="text-right">
        <Checkbox value={checked} disabled={name == null} />
      </Td>
    </Tr>
  );
};
