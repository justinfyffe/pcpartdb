import {
  formatProductField,
  getProductFieldLabel,
  isProductField,
  ProductField,
  ProductType,
} from '@pcpartdb/shared';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Checkbox, Td, Tr } from '../../../../shared/components';
import { BooleanFormatter } from '../../../../shared/format';
import { ScrapeProductContext } from './ScrapeProductContext';
import { ScrapedDataKey } from './types';

interface ScrapedDataRowProps {
  field: ScrapedDataKey;
}

export const ScrapedDataRow: FunctionComponent<ScrapedDataRowProps> = (
  props,
) => {
  const { field } = props;

  const context = useContext(ScrapeProductContext);
  const productType = context.productType;
  const scrapedData = context.scrapedData;

  const emptyValue = useMemo(() => getEmptyValue(field), [field]);
  const label = useMemo(
    () => getLabel(productType, field),
    [productType, field],
  );

  const displayValue = useMemo(() => {
    const dataField = scrapedData?.[field];
    const dataValue = dataField?.value;

    if (isProductField(dataValue)) {
      return (
        formatProductField(productType, dataValue, {
          booleanFormatter: BooleanFormatter.YesNo,
        }) || '--'
      );
    }

    return dataValue || '--';
  }, [scrapedData, field, productType]);

  const [checked, setChecked] = useState(() => false);

  useEffect(() => {
    if (scrapedData[field] == null) {
      scrapedData[field] = { value: emptyValue, enabled: false };
      setChecked(false);
    } else {
      setChecked(scrapedData[field].enabled);
    }
  }, [scrapedData, field, emptyValue]);

  const handleClick = useCallback(() => {
    const dataField = scrapedData[field];
    const dataValue = scrapedData[field].value;

    dataField.enabled = !checked;
    if (isProductField(dataValue)) {
      dataValue.meta.autoUpdate = !checked;
    }

    setChecked(!checked);
  }, [checked, scrapedData, field]);

  return (
    <Tr onClick={handleClick} className="hover:bg-mouse-hover cursor-pointer">
      <Td>{label}</Td>
      <Td>{displayValue}</Td>
      <Td className="text-right">
        <Checkbox value={scrapedData?.[field]?.enabled ?? false} />
      </Td>
    </Tr>
  );
};

function getLabel(productType: ProductType, fieldKey: ScrapedDataKey): string {
  if (fieldKey === 'name') {
    return 'Name';
  }

  return getProductFieldLabel(productType, fieldKey);
}

function getEmptyValue(fieldKey: ScrapedDataKey): ProductField {
  if (fieldKey === 'name') {
    return null;
  }

  return {
    value: null,
    meta: { fieldKey, autoUpdate: false },
  };
}
