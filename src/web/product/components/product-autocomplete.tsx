import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Product, ProductType } from '../../../types/product';
import { Autocomplete } from '../../shared/components/autocomplete';
import { productService } from '../product.service';

interface ProductAutocompleteProps {
  productType: ProductType;

  value?: number;
  onChange?: (value: number) => void;
  onProduct?: (product: Product) => void;

  ref?: unknown;
}

export const ProductAutocomplete: FunctionComponent<
  ProductAutocompleteProps
> = (props) => {
  const { productType: type, onChange, onProduct, value, ...restProps } = props;

  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      const result = await productService.get(value);
      setProduct(result);
      onProduct(result);
    }
    fetchProduct();
  }, [value, onProduct]);

  const handleQuery = useCallback(
    async (query: string) => {
      const results = await productService.autocompleteProduct(query, type);

      return results
        .filter((product) => product != null)
        .map((product) => ({ label: product.name, value: `${product.id}` }));
    },
    [type],
  );

  const handleChange = useCallback(
    (value: string) => {
      onChange(Number(value));
    },
    [onChange],
  );

  // TODO: how to pass label/value?
  return (
    <Autocomplete
      label={product?.name}
      value={`${value}`}
      onQuery={handleQuery}
      onChange={handleChange}
      {...restProps}
    />
  );
};
