import {
  getProductFieldLabel,
  ProductField,
  productFieldFormattedValue,
  ProductType,
} from '@pcpartdb/shared';
import {
  Td,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent, useMemo } from 'react';
import { classNames } from '../../../shared/ui/classNames';

interface ProductFieldRowProps {
  type: ProductType;
  fields: ProductField[];

  className?: string;
}

export const ProductFieldRow: FunctionComponent<ProductFieldRowProps> = (
  props,
) => {
  const { type, className } = props;

  const fields = useMemo(() => props.fields || [], [props.fields]);
  const [field1, field2] = fields;

  const label = useMemo(() => {
    const fieldKey = field1?.meta?.fieldKey || field2?.meta?.fieldKey;

    return getProductFieldLabel(type, fieldKey);
  }, [type, field1?.meta?.fieldKey, field2?.meta?.fieldKey]);

  const fieldValues = useMemo(() => {
    return fields.map((field) => productFieldFormattedValue(field)) || [];
  }, [fields]);

  const hasValues = useMemo(
    () => fieldValues.some((value) => value != null && value !== ''),
    [fieldValues],
  );

  if (!hasValues) {
    return <></>;
  }

  return (
    <Tr className={className}>
      <Td
        className={classNames(
          'text-left',
          fields.length === 1 ? 'w-[50%]' : '',
          fields.length === 2 ? 'w-[33%]' : '',
        )}
      >
        {label}
      </Td>
      {fieldValues.map((value, i) => (
        <Td
          key={i}
          className={classNames(
            'text-left',
            fields.length === 1 ? 'w-[50%]' : '',
            fields.length === 2 ? 'w-[33%]' : '',
          )}
        >
          {value ?? '--'}
        </Td>
      ))}
    </Tr>
  );
};
