'use client';

import {
  getCompareProductsPath,
  getViewProductPath,
  ProductComparison,
  ProductType,
} from '@pcpartdb/shared';
import React, { FormEvent, useCallback, useMemo, useState } from 'react';
import { ProductCache } from '../../../cache/ProductCache';
import { PrimaryButton } from '../../../components/Button/PrimaryButton';
import { Form } from '../../../components/Form/Form';
import { classNames } from '../../../utils/classNames';
import { ProductAutocomplete } from '../ProductAutocomplete/ProductAutocomplete';

interface CompareProductsFormProps {
  productType: ProductType;
  values?: number[];

  navigateOnChange?: boolean;

  className?: string;
}

export function CompareProductsForm(props: CompareProductsFormProps) {
  const { productType, navigateOnChange, className } = props;

  const [values, setValues] = useState<number[]>(props.values || [null, null]);

  const filteredValues = useMemo(
    () => values?.filter((value) => value != null),
    [values],
  );

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      e.stopPropagation();

      navigateToProductsPage(productType, values);
    },
    [productType, values],
  );

  const onProductChange = useCallback(
    (i: number, value: number) => {
      const newValues = [...(values ?? [])];
      newValues[i] = value;
      setValues(newValues);

      if (navigateOnChange) {
        navigateToProductsPage(productType, newValues);
      }
    },
    [navigateOnChange, productType, values],
  );

  return (
    <Form
      onSubmit={handleSubmit}
      className={classNames(
        'flex flex-row gap-x-4 w-full',
        'md:flex-col gap-y-4',
        className,
      )}
    >
      <div className={classNames('flex flex-1 gap-4 md:flex-col md:gap-1')}>
        <ProductAutocomplete
          productType={productType}
          className={classNames('flex-1 min-w-38')}
          onChange={(value) => onProductChange(0, value)}
          value={values?.[0]}
        />

        <div
          className={classNames(
            'font-medium self-center row-span-2 text-center w-12.5',
          )}
        >
          VS
        </div>

        <ProductAutocomplete
          productType={productType}
          className={classNames('flex-1 min-w-38')}
          onChange={(value) => onProductChange(1, value)}
          value={values?.[1]}
        />
      </div>

      {!navigateOnChange && (
        <PrimaryButton
          type="submit"
          disabled={!filteredValues?.length}
          className="min-w-25"
        >
          {filteredValues?.length === 1 ? 'View' : 'Compare'}
        </PrimaryButton>
      )}
    </Form>
  );
}

function navigateToProductsPage(
  productType: ProductType,
  productIds: number[],
) {
  const products =
    productIds
      ?.filter((productId) => productId != null)
      .map((productId) => ProductCache.get(productType, productId!)) ?? [];

  if (products.length === 2 && products[0].id !== products[1].id) {
    window.location.href = getCompareProductsPath({
      comparison: products as ProductComparison,
    });
    return;
  } else if (products.length === 1 || products[0].id === products[1].id) {
    window.location.href = getViewProductPath({ product: products[0] });
    return;
  } else {
    return;
  }
}
