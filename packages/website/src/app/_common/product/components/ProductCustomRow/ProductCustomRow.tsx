import React from 'react';
import { Td } from '../../../components/Table/Td';
import { Tr } from '../../../components/Table/Tr';
import { classNames } from '../../../utils/classNames';

type LabelType = string | React.ReactNode;
type ValueType = string | React.ReactNode;

interface ProductCustomRowProps {
  label: LabelType;
  value?: ValueType;
  values?: ValueType[];
  highlight?: 'primary' | 'secondary';

  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

export function ProductCustomRow(props: ProductCustomRowProps) {
  const { label, className, labelClassName, valueClassName, highlight } = props;

  const values = props.values || [props.value];
  const hasValues = values.some((value) => value != null);

  if (!hasValues) {
    return <></>;
  }

  return (
    <Tr className={className}>
      <Td
        className={classNames(
          'text-left',
          values.length === 1 ? 'w-[50%]' : '',
          values.length === 2 ? 'w-[33%]' : '',
          labelClassName,
          highlight === 'primary' ? 'font-bold !bg-indigo-100' : '',
          highlight === 'secondary' ? 'font-bold !bg-fuchsia-100' : '',
        )}
      >
        {label}
      </Td>
      {values.map((value, i) => (
        <Td
          key={i}
          className={classNames(
            'text-left',
            values.length === 1 ? 'w-[50%]' : '',
            values.length === 2 ? 'w-[33%]' : '',
            valueClassName,
            highlight === 'primary' ? 'font-bold !bg-indigo-100' : '',
            highlight === 'secondary' ? 'font-bold !bg-fuchsia-100' : '',
          )}
        >
          {value ?? '--'}
        </Td>
      ))}
    </Tr>
  );
}
