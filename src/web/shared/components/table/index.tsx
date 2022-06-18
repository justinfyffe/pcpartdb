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

interface THeadProps extends HTMLProps<HTMLTableRowElement> {}

export const THead: FunctionComponent<THeadProps> = (props) => {
  const { children, ...htmlProps } = props;

  return <thead {...htmlProps}>{children}</thead>;
};

interface TBodyProps extends HTMLProps<HTMLTableRowElement> {}

export const TBody: FunctionComponent<TBodyProps> = (props) => {
  const { children, ...htmlProps } = props;

  return <tbody {...htmlProps}>{children}</tbody>;
};

interface TrProps extends HTMLProps<HTMLTableRowElement> {}

export const Tr: FunctionComponent<TrProps> = (props) => {
  const { children, ...htmlProps } = props;

  return <tr {...htmlProps}>{children}</tr>;
};

interface TdProps extends HTMLProps<HTMLTableCellElement> {}

export const Td: FunctionComponent<TdProps> = (props) => {
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
