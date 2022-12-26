import { Td, Tr } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import React from 'react';

interface CustomRowProps {
  highlight?: boolean;

  children?: React.ReactElement<CustomRowLabelProps | CustomRowValueProps>[];
}

export const CustomRow = (props: CustomRowProps) => {
  const { children, highlight } = props;

  return (
    <Tr className={classNames(highlight ? 'font-bold !bg-indigo-100' : '')}>
      {children}
    </Tr>
  );
};

interface CustomRowLabelProps {
  children?: React.ReactNode;
}

export const CustomRowLabel = (props: CustomRowLabelProps) => {
  const { children } = props;

  return <Td className="text-left w-[50%]">{children}</Td>;
};

interface CustomRowValueProps {
  children?: React.ReactNode;

  className?: string;
}

export const CustomRowValue = (props: CustomRowValueProps) => {
  const { children, className } = props;

  return (
    <Td className={classNames('text-left w-[50%]', className)}>{children}</Td>
  );
};
