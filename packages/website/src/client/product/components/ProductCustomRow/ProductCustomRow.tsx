import React, { FunctionComponent, useMemo } from 'react';
import { Td, Tr } from '../../../shared/components';
import { classNames } from '../../../shared/ui';

type LabelType = string | React.ReactNode;
type ValueType = string | React.ReactNode;

interface ProductCustomRowProps {
  label: LabelType;
  values: ValueType[];
  highlight?: 'primary' | 'secondary';

  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

export const ProductCustomRow: FunctionComponent<ProductCustomRowProps> = (
  props,
) => {
  const {
    label,
    values,
    className,
    labelClassName,
    valueClassName,
    highlight,
  } = props;

  const hasValues = useMemo(
    () => values.some((value) => value != null),
    [values],
  );

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
          {value || '--'}
        </Td>
      ))}
    </Tr>
  );
};
