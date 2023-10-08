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

interface ScrapedSearchTextRowProps {}

export const ScrapedSearchTextRow: FunctionComponent<
  ScrapedSearchTextRowProps
> = (_props) => {
  const context = useContext(ScrapeProductContext);
  const scrapedData = context.data;

  const emptyValue = '';
  const label = 'Searchable Text';
  const formattedValue = `${scrapedData?.searchText?.value ?? '--'}`;

  const [checked, setChecked] = useState(() => false);

  useEffect(() => {
    if (scrapedData.searchText == null) {
      scrapedData.searchText = { value: emptyValue, enabled: false };
      setChecked(false);
    } else {
      setChecked(scrapedData.searchText.enabled);
    }
  }, [emptyValue, scrapedData]);

  const handleClick = useCallback(() => {
    const searchTextData = scrapedData.searchText;
    searchTextData.enabled = !checked;

    setChecked(!checked);
  }, [scrapedData.searchText, checked]);

  return (
    <Tr onClick={handleClick} className="hover:bg-mouse-hover cursor-pointer">
      <Td>{label}</Td>
      <Td colSpan={2}>{formattedValue}</Td>
      <Td className="text-right">
        <Checkbox value={scrapedData.searchText?.enabled ?? false} />
      </Td>
    </Tr>
  );
};
