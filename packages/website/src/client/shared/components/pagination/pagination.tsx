import React, { FunctionComponent, useMemo } from 'react';
import { classNames } from '../../ui';

interface PaginationProps {
  className?: string;

  neighborPagesDisplayed?: number;
  marginPagesDisplayed?: number;

  hidePages?: boolean;

  currentPage: number;
  resultsPerPage: number;
  totalResults: number;

  hrefBuilder: (page: number) => string;
  onPageClick?: (page: number, event?: React.MouseEvent) => void;
}

export const Pagination: FunctionComponent<PaginationProps> = (props) => {
  const {
    currentPage,
    resultsPerPage,
    totalResults,
    hrefBuilder,
    onPageClick,
  } = props;

  const hidePages = props.hidePages ?? false;
  const neighborPagesDisplayed = props.neighborPagesDisplayed ?? 2;
  const marginPagesDisplayed = props.marginPagesDisplayed ?? 2;

  const totalPages = useMemo(
    () => Math.ceil(totalResults / resultsPerPage),
    [totalResults, resultsPerPage],
  );

  const left = useMemo(() => {
    const pages: number[] = [];
    for (let i = 1; i <= marginPagesDisplayed && i <= totalPages; ++i) {
      pages.push(i);
    }
    return pages;
  }, [marginPagesDisplayed, totalPages]);

  const middle = useMemo(() => {
    const start = Math.max(1, currentPage - neighborPagesDisplayed);
    const end = Math.min(totalPages, currentPage + neighborPagesDisplayed);

    const pages: number[] = [];
    for (let i = start; i <= end; ++i) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, neighborPagesDisplayed, totalPages]);

  const right = useMemo(() => {
    const start = Math.max(1, totalPages - marginPagesDisplayed + 1);
    const pages: number[] = [];
    for (let i = start; i <= totalPages; ++i) {
      pages.push(i);
    }
    return pages;
  }, [totalPages, marginPagesDisplayed]);

  const pages = useMemo(() => {
    const existingPages = new Set<number>(left);

    const pages: number[] = [...left];
    for (let i = 0; i < middle.length; ++i) {
      const page = middle[i];
      if (existingPages.has(page)) {
        continue;
      }

      if (page - 1 !== pages[pages.length - 1]) {
        pages.push(null);
      }

      pages.push(page);
      existingPages.add(page);
    }

    for (let i = 0; i < right.length; ++i) {
      const page = right[i];
      if (existingPages.has(page)) {
        continue;
      }

      if (page - 1 !== pages[pages.length - 1]) {
        pages.push(null);
      }

      pages.push(page);
      existingPages.add(page);
    }

    return pages;
  }, [left, middle, right]);

  if (pages.length === 1) {
    return <></>;
  }

  return (
    <nav
      className={classNames(
        'flex gap-6 justify-between items-center font-semibold p-2',
        props.className,
      )}
    >
      {currentPage > 1 ? (
        <a
          href={hrefBuilder(currentPage - 1)}
          onClick={(evt) => onPageClick?.(currentPage - 1, evt)}
        >
          Previous
        </a>
      ) : (
        <div></div>
      )}

      {!hidePages && (
        <ul className="flex gap-8">
          {pages.map((page, i) => (
            <li key={page || `null-${i}`}>
              {page == null ? (
                <>&hellip;</>
              ) : (
                <>
                  {page === currentPage ? (
                    <>{page}</>
                  ) : (
                    <a
                      href={hrefBuilder(page)}
                      onClick={(evt) => onPageClick?.(page, evt)}
                    >
                      {page}
                    </a>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {currentPage < totalPages ? (
        <a
          href={hrefBuilder(currentPage + 1)}
          onClick={(evt) => onPageClick?.(currentPage + 1, evt)}
        >
          Next
        </a>
      ) : (
        <div></div>
      )}
    </nav>
  );
};
