import { Checkbox, Td, Tr } from '@client/shared/components';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ImportPartDataContext } from './import-part-data-context';

interface ImportNameProps {}

export const ImportName: FunctionComponent<ImportNameProps> = (_props) => {
  const context = useContext(ImportPartDataContext);
  const emptyValue: string = null;

  const [checked, setChecked] = useState(() => false);

  useEffect(() => {
    if (context.name == null) {
      context.name = { value: emptyValue, import: false };
      setChecked(false);
    } else {
      setChecked(context.name.import);
    }
  }, [context, emptyValue]);

  const handleClick = useCallback(() => {
    if (checked) {
      context.name.import = true;
    } else {
      context.name.import = false;
    }

    setChecked(!checked);
  }, [context, checked]);

  return (
    <Tr onClick={handleClick} className="hover:bg-gray-200 cursor-pointer">
      <Td>Name</Td>
      <Td>{context.name?.value || '--'}</Td>
      <Td className="text-right">
        <Checkbox value={context.name?.import ?? false} />
      </Td>
    </Tr>
  );
};
