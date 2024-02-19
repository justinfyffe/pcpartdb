'use client';

import { getAdminEditProductPath, Product } from '@pcpartdb/shared';
import React from 'react';
import { useConfig } from '../../../contexts/ConfigProvider';

interface EditProductLinkProps {
  product: Product;
  children: React.ReactNode;
}

export function EditProductLink(props: EditProductLinkProps) {
  const { product, children } = props;
  const { config } = useConfig();

  if (!config.isStaff) {
    return <></>;
  }

  if (product == null) {
    return <></>;
  }

  return (
    <a href={getAdminEditProductPath({ product })} target="_blank">
      {children}
    </a>
  );
}
