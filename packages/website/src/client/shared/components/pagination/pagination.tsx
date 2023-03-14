import React, { FunctionComponent, useMemo } from 'react';
import { classNames } from '../../ui';

interface PaginationProps {
  className?: string;

  neighborPagesDisplayed?: number;
  marginPagesDisplayed?: number;

  currentPage: number;
  resultsPerPage: number;
  totalResults: number;
}

export const Pagination: FunctionComponent<PaginationProps> = (props) => {
  const { currentPage, resultsPerPage, totalResults } = props;

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
    const start = Math.max(1, totalPages - marginPagesDisplayed);
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

  return (
    <nav className={classNames('flex gap-2', props.className)}>
      {currentPage > 1 ? <a href="#">Previous</a> : <></>}

      <ul className="flex gap-2">
        {pages.map((page, i) => (
          <li key={page || `null-${i}`}>
            {page == null ? (
              <>&hellip;</>
            ) : (
              <>{page === currentPage ? <>{page}</> : <a href="#">{page}</a>}</>
            )}
          </li>
        ))}
      </ul>

      {currentPage < totalPages ? <a href="#">Next</a> : <></>}
    </nav>
  );
};
