import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Checkbox, Td, Tr } from '../../../../shared/components';
import { ScrapeGpuDetailsContext } from './scrape-gpu-details-context';

interface ScrapeNameProps {}

export const ScrapeName: FunctionComponent<ScrapeNameProps> = (_props) => {
  const context = useContext(ScrapeGpuDetailsContext);
  const emptyValue: string = null;

  const [checked, setChecked] = useState(() => false);

  useEffect(() => {
    if (context.name == null) {
      context.name = { value: emptyValue, enabled: false };
      setChecked(false);
    } else {
      setChecked(context.name.enabled);
    }
  }, [context, emptyValue]);

  const handleClick = useCallback(() => {
    if (checked) {
      context.name.enabled = true;
    } else {
      context.name.enabled = false;
    }

    setChecked(!checked);
  }, [context, checked]);

  return (
    <Tr onClick={handleClick} className="hover:bg-gray-200 cursor-pointer">
      <Td>Name</Td>
      <Td>{context.name?.value || '--'}</Td>
      <Td className="text-right">
        <Checkbox value={context.name?.enabled ?? false} />
      </Td>
    </Tr>
  );
};
