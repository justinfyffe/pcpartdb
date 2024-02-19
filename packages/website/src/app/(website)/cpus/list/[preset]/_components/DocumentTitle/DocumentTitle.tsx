'use client';

import React, { FunctionComponent, useEffect } from 'react';
import { buildDocumentTitle } from '../../_content/buildDocumentTitle';
import { useListContext } from '../../ListProvider';

export const DocumentTitle: FunctionComponent = () => {
  const { query } = useListContext();

  useEffect(() => {
    const title = buildDocumentTitle(query);
    document.title = title;
  }, [query]);

  return <></>;
};
