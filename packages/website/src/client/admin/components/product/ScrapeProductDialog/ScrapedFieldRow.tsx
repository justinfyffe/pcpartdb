import {
  getProductFieldLabel,
  isProductField,
  ProductField,
  productFieldFormattedValue,
  ProductFieldKey,
  productFieldRawValue,
  ProductType,
} from '@pcpartdb/shared';
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

interface ScrapedFieldRowProps {
  fieldKey?: ProductFieldKey;
}

export const ScrapedFieldRow: FunctionComponent<ScrapedFieldRowProps> = (
  props,
) => {
  const { fieldKey } = props;

  const context = useContext(ScrapeProductContext);
  const productType = context.productType;
  const fields = context.data.fields;

  const emptyValue = useMemo(() => getEmptyValue(fieldKey), [fieldKey]);
  const label = useMemo(
    () => getLabel(productType, fieldKey),
    [productType, fieldKey],
  );

  const rawValue = useMemo(() => {
    const dataValue = fields?.[fieldKey]?.value;

    if (isProductField(dataValue)) {
      return `${productFieldRawValue(dataValue) ?? '--'}`;
    }

    return `${dataValue ?? '--'}`;
  }, [fields, fieldKey]);

  const formattedValue = useMemo(() => {
    const dataValue = fields?.[fieldKey]?.value;

    if (isProductField(dataValue)) {
      return productFieldFormattedValue(dataValue) ?? '--';
    }

    return `${dataValue ?? '--'}`;
  }, [fields, fieldKey]);

  const [checked, setChecked] = useState(() => false);

  useEffect(() => {
    if (fields[fieldKey] == null) {
      fields[fieldKey] = { value: emptyValue, enabled: false };
      setChecked(false);
    } else {
      setChecked(fields[fieldKey].enabled);
    }
  }, [fields, fieldKey, emptyValue]);

  const handleClick = useCallback(() => {
    const dataField = fields[fieldKey];
    const dataValue = fields[fieldKey].value;

    dataField.enabled = !checked;
    if (isProductField(dataValue)) {
      dataValue.meta.autoUpdate = !checked;
    }

    setChecked(!checked);
  }, [checked, fields, fieldKey]);

  return (
    <Tr onClick={handleClick} className="hover:bg-mouse-hover cursor-pointer">
      <Td>{label}</Td>
      <Td>{rawValue}</Td>
      <Td>{formattedValue}</Td>
      <Td className="text-right">
        <Checkbox value={fields?.[fieldKey]?.enabled ?? false} />
      </Td>
    </Tr>
  );
};

function getLabel(productType: ProductType, fieldKey: ProductFieldKey): string {
  return getProductFieldLabel(productType, fieldKey);
}

function getEmptyValue(fieldKey: ProductFieldKey): ProductField {
  return {
    value: null,
    meta: { fieldKey, autoUpdate: false, formattedValue: '' },
  };
}
