import {
  getProductFieldLabel,
  ProductField,
  productFieldFormattedValue,
  ProductType,
} from '@pcpartdb/shared';
import React from 'react';
import { Td } from '../../../components/Table/Td';
import { Tr } from '../../../components/Table/Tr';
import { classNames } from '../../../utils/classNames';

interface ProductFieldRowProps {
  type: ProductType;
  fields: ProductField[];

  className?: string;
}

export function ProductFieldRow(props: ProductFieldRowProps) {
  const { type, className } = props;

  const fields = props.fields || [];
  const [field1, field2] = fields;

  const fieldKey = field1?.meta?.fieldKey || field2?.meta?.fieldKey;
  const label = getProductFieldLabel(type, fieldKey);

  const fieldValues =
    fields.map((field) => productFieldFormattedValue(field)) || [];

  const hasValues = fieldValues.some((value) => value != null && value !== '');

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
}
