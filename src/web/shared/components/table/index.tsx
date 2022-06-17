import React, { FunctionComponent, HTMLProps } from 'react';
import { classNames } from '../../ui/ui.utils';

interface TableProps extends HTMLProps<HTMLTableElement> {
  responsive?: boolean;
}

export const Table: FunctionComponent<TableProps> = (props) => {
  const { children, responsive = false, ...htmlProps } = props;

  return (
    <React.Fragment>
      {responsive && (
        <div className="block overflow-x-auto w-full">
          <table
            {...htmlProps}
            className={classNames(
              'border-collapse mb-4 w-full max-w-full',
              props.className,
            )}
          >
            {children}
          </table>
        </div>
      )}
      {!responsive && (
        <table
          {...htmlProps}
          className={classNames(
            'border-collapse mb-4 w-full max-w-full',
            props.className,
          )}
        >
          {children}
        </table>
      )}
    </React.Fragment>
  );
};

interface TableRowProps extends HTMLProps<HTMLTableRowElement> {}

export const TableRow: FunctionComponent<TableRowProps> = (props) => {
  const { children, ...htmlProps } = props;

  return <tr {...htmlProps}>{children}</tr>;
};

interface TableCellProps extends HTMLProps<HTMLTableCellElement> {}

export const TableCell: FunctionComponent<TableCellProps> = (props) => {
  const { children, className, ...htmlProps } = props;

  return (
    <td
      {...htmlProps}
      className={classNames('text-left p-2 md:px-2 md:py-4', className)}
    >
      {children}
    </td>
  );
};

export const TableHeaderCell = TableCell;
