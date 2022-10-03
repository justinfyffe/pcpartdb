import { useRouter } from 'next/router';
import React, {
  FormEvent,
  FunctionComponent,
  useCallback,
  useState,
} from 'react';
import { ProductType } from '../../../types/product';
import { ProductAutocomplete } from '../../product/components/product-autocomplete';
import { ProductCache } from '../../shared/cache';
import { Button, ButtonVariant } from '../../shared/components/button';
import { Form } from '../../shared/components/form';
import { classNames } from '../../shared/ui/ui.utils';

interface CompareFormProps {
  className?: string;

  values?: number[];
}

export const CompareForm: FunctionComponent<CompareFormProps> = (props) => {
  const { className } = props;

  const router = useRouter();
  const [values, setValues] = useState(props.values ?? [null, null]);

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
        router.push(`/gpus/compare/${products[0].slug}-vs-${products[1].slug}`);
        return;
      } else if (products.length === 1) {
        router.push(`/gpus/view/${products[0].slug}`);
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
        'flex flex-col gap-4 w-full',
        values.length > 2 ? 'lg:flex-row' : 'md:flex-row',
        className,
      )}
    >
      <div
        className={classNames(
          'flex-1 gap-4 grid grid-cols-[1fr_auto]',
          values.length > 2
            ? 'lg:flex'
            : values.length > 1
            ? 'md:flex'
            : 'flex',
        )}
      >
        <ProductAutocomplete
          productType={ProductType.GPU}
          className={classNames('flex-1 min-w-[150px]')}
          onChange={(value) => onProductChange(0, value)}
          value={values[0]}
        />

        <div
          className={classNames('font-medium self-center text-center w-[50px]')}
        >
          VS
        </div>

        <ProductAutocomplete
          productType={ProductType.GPU}
          className={classNames('flex-1 min-w-[150px]')}
          onChange={(value) => onProductChange(1, value)}
          value={values[1]}
        />
      </div>

      <Button
        type="submit"
        variant={ButtonVariant.Primary}
        className="min-w-[100px]"
      >
        {values.length > 1 ? 'Compare' : 'Search'}
      </Button>
    </Form>
  );
};
