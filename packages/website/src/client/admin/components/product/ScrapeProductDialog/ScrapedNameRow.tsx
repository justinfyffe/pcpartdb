import { Checkbox } from 'packages/website/src/client/shared/components/Checkbox/Checkbox';
import {
  Td,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ScrapeProductContext } from './ScrapeProductContext';

interface ScrapedNameRowProps {}

export const ScrapedNameRow: FunctionComponent<ScrapedNameRowProps> = (
  _props,
) => {
  const context = useContext(ScrapeProductContext);
  const scrapedData = context.data;

  const emptyValue = '';
  const label = 'Name';
  const formattedValue = `${scrapedData?.name?.value ?? '--'}`;

  const [checked, setChecked] = useState(() => false);

  useEffect(() => {
    if (scrapedData.name == null) {
      scrapedData.name = { value: emptyValue, enabled: false };
      setChecked(false);
    } else {
      setChecked(scrapedData.name.enabled);
    }
  }, [emptyValue, scrapedData]);

  const handleClick = useCallback(() => {
    const nameData = scrapedData.name;
    nameData.enabled = !checked;

    setChecked(!checked);
  }, [scrapedData.name, checked]);

  return (
    <Tr onClick={handleClick} className="hover:bg-mouse-hover cursor-pointer">
      <Td>{label}</Td>
      <Td colSpan={2}>{formattedValue}</Td>
      <Td className="text-right">
        <Checkbox value={scrapedData.name?.enabled ?? false} />
      </Td>
    </Tr>
  );
};
