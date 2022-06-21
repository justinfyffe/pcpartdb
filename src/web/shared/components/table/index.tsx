import React, {
  createContext,
  FunctionComponent,
  HTMLProps,
  useContext,
  useState,
} from 'react';
import { classNames } from '../../ui/ui.utils';

interface TableState {
  border: boolean;
}

const TableContext = createContext<TableState>({
  border: false,
});

interface TableProps extends HTMLProps<HTMLTableElement> {
  responsive?: boolean;
  border?: boolean;
}

export const Table: FunctionComponent<TableProps> = (props) => {
  const { children, border = false, responsive = false, ...htmlProps } = props;
  const [context] = useState<TableState>({ border });

  return (
    <React.Fragment>
      <TableContext.Provider value={context}>
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
      </TableContext.Provider>
    </React.Fragment>
  );
};

interface THeadProps extends HTMLProps<HTMLTableSectionElement> {}

export const THead: FunctionComponent<THeadProps> = (props) => {
  const { children, ...htmlProps } = props;

  return <thead {...htmlProps}>{children}</thead>;
};

interface TBodyProps extends HTMLProps<HTMLTableSectionElement> {}

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
  const context = useContext(TableContext);

  return (
    <td
      {...htmlProps}
      className={classNames(
        'text-left p-2 md:px-2 md:py-4',
        context.border ? 'border' : '',
        className,
      )}
    >
      {children}
    </td>
  );
};
