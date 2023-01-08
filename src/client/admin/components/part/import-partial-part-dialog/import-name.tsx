import { Checkbox, Td, Tr } from '@client/shared/components';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ImportPartialPartContext } from './import-partial-part-context';

interface ImportNameProps {}

export const ImportName: FunctionComponent<ImportNameProps> = (_props) => {
  const context = useContext(ImportPartialPartContext);
  const [name] = useState(() => {
    if (context.name == null) {
      delete context.name;
      return null;
    }
    return context.name;
  });
  const [checked, setChecked] = useState(() => name != null);

  useEffect(() => {
    if (name == null) {
      delete context.name;
    }
  }, [context, name]);

  const handleClick = useCallback(() => {
    if (checked) {
      delete context.name;
    } else {
      context.name = name;
    }

    setChecked(!checked);
  }, [context, name, checked]);

  return (
    <Tr onClick={handleClick} className="hover:bg-gray-200 cursor-pointer">
      <Td>Name</Td>
      <Td>{name}</Td>
      <Td className="text-right">
        <Checkbox value={checked} />
      </Td>
    </Tr>
  );
};
