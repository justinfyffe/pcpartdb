import { formatCompanyName } from '@pcpartdb/shared';
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

interface ScrapedCompanyRowProps {}

export const ScrapedCompanyRow: FunctionComponent<ScrapedCompanyRowProps> = (
  _props,
) => {
  const context = useContext(ScrapeProductContext);
  const scrapedData = context.data;

  const emptyValue = '';
  const label = 'Company';
  const formattedValue = `${
    formatCompanyName(scrapedData?.company?.value as string) ?? '--'
  }`;

  const [checked, setChecked] = useState(() => false);

  useEffect(() => {
    if (scrapedData.company == null) {
      scrapedData.company = { value: emptyValue, enabled: false };
      setChecked(false);
    } else {
      setChecked(scrapedData.company.enabled);
    }
  }, [emptyValue, scrapedData]);

  const handleClick = useCallback(() => {
    const companyData = scrapedData.company;
    companyData.enabled = !checked;

    setChecked(!checked);
  }, [scrapedData.company, checked]);

  return (
    <Tr onClick={handleClick} className="hover:bg-mouse-hover cursor-pointer">
      <Td>{label}</Td>
      <Td colSpan={2}>{formattedValue}</Td>
      <Td className="text-right">
        <Checkbox value={scrapedData.company?.enabled ?? false} />
      </Td>
    </Tr>
  );
};
