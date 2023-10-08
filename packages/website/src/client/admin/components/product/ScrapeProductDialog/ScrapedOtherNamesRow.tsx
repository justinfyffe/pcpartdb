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
  useMemo,
  useState,
} from 'react';
import { ScrapeProductContext } from './ScrapeProductContext';

interface ScrapedOtherNamesRowProps {}

export const ScrapedOtherNamesRow: FunctionComponent<
  ScrapedOtherNamesRowProps
> = (_props) => {
  const context = useContext(ScrapeProductContext);
  const scrapedData = context.data;

  const label = 'Other Names';

  const formattedValue = useMemo(() => {
    const dataValue = scrapedData?.otherNames?.value as string[];

    return `${dataValue?.join(', ') ?? '--'}`;
  }, [scrapedData?.otherNames?.value]);

  const [checked, setChecked] = useState(() => false);

  useEffect(() => {
    if (scrapedData.otherNames == null) {
      scrapedData.otherNames = { value: [], enabled: false };
      setChecked(false);
    } else {
      setChecked(scrapedData.searchText.enabled);
    }
  }, [scrapedData]);

  const handleClick = useCallback(() => {
    const otherNamesData = scrapedData.otherNames;
    otherNamesData.enabled = !checked;

    setChecked(!checked);
  }, [scrapedData.otherNames, checked]);

  return (
    <Tr onClick={handleClick} className="hover:bg-mouse-hover cursor-pointer">
      <Td>{label}</Td>
      <Td colSpan={2}>{formattedValue}</Td>
      <Td className="text-right">
        <Checkbox value={scrapedData.otherNames?.enabled ?? false} />
      </Td>
    </Tr>
  );
};
