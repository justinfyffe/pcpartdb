import {
  getCompareProductsPath,
  getViewProductPath,
  ProductComparison,
  ProductType,
} from '@pcpartdb/shared';
import React, {
  FormEvent,
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useProductCache } from '../../../shared/cache';
import { PrimaryButton } from '../../../shared/components/Button/PrimaryButton';
import { Form } from '../../../shared/components/Form/Form';
import { classNames } from '../../../shared/ui';
import { ProductAutocomplete } from '../ProductAutocomplete';

interface CompareProductsFormProps {
  productType: ProductType;
  values?: number[];

  className?: string;
}

export const CompareProductsForm: FunctionComponent<
  CompareProductsFormProps
> = (props) => {
  const { productType, className } = props;

  const productCache = useProductCache();

  const [values, setValues] = useState(props.values ?? [null, null]);

  const filteredValues = useMemo(
    () => values.filter((value) => value != null),
    [values],
  );

  const onProductChange = useCallback(
    (i: number, value: number) => {
      const newValues = [...values];
      newValues[i] = value;
      setValues(newValues);
    },
    [values],
  );

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const products = values
        .filter((value) => value != null)
        .map((value) => productCache.get(productType, value));

      if (products.length === 2 && products[0].id !== products[1].id) {
        window.location.href = getCompareProductsPath(
          productType,
          products as ProductComparison,
        );
        return;
      } else if (products.length === 1 || products[0].id === products[1].id) {
        window.location.href = getViewProductPath(productType, products[0]);
        return;
      } else {
        return;
      }
    },
    [productCache, productType, values],
  );

  return (
    <Form
      onSubmit={handleSubmit}
      className={classNames(
        'flex flex-row gap-4 w-full',
        'md:flex-col',
        className,
      )}
    >
      <div
        className={classNames('flex flex-1 gap-4 md:grid grid-cols-[1fr_auto]')}
      >
        <ProductAutocomplete
          productType={productType}
          className={classNames('flex-1 min-w-38')}
          onChange={(value) => onProductChange(0, value)}
          value={values[0]}
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
          value={values[1]}
        />
      </div>

      <PrimaryButton
        type="submit"
        disabled={filteredValues.length === 0}
        className="min-w-25"
      >
        {filteredValues.length === 1 ? 'View' : 'Compare'}
      </PrimaryButton>
    </Form>
  );
};
