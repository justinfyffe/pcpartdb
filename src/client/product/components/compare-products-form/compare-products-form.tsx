import {
  getCompareGpusSlug,
  getViewGpuSlug,
} from '@client/product/product-utils';
import { ProductCache } from '@client/shared/cache';
import { Button, ButtonVariant, Form } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import { ProductComparison, ProductType } from '@shared/product';
import { useRouter } from 'next/router';
import React, {
  FormEvent,
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { ProductAutocomplete } from '../product-autocomplete';

interface CompareProductsFormProps {
  className?: string;

  values?: number[];
}

export const CompareProductsForm: FunctionComponent<
  CompareProductsFormProps
> = (props) => {
  const { className } = props;

  const router = useRouter();
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
        .map((value) => ProductCache.get(value));

      if (products.length === 2) {
        router.push(getCompareGpusSlug(products as ProductComparison));
        return;
      } else if (products.length === 1) {
        router.push(getViewGpuSlug(products[0]));
        return;
      } else {
        return;
      }
    },
    [values, router],
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
          productType={ProductType.GPU}
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
          productType={ProductType.GPU}
          className={classNames('flex-1 min-w-38')}
          onChange={(value) => onProductChange(1, value)}
          value={values[1]}
        />
      </div>

      <Button
        type="submit"
        variant={ButtonVariant.Primary}
        disabled={filteredValues.length === 0}
        className="min-w-25"
      >
        {filteredValues.length === 1 ? 'Search' : 'Compare'}
      </Button>
    </Form>
  );
};
