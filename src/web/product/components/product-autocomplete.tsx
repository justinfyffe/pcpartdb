import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Product, ProductType } from '../../../types/product';
import {
  Autocomplete,
  AutocompleteOptionProps,
} from '../../shared/components/autocomplete';
import { productService } from '../product.service';

interface ProductAutocompleteProps {
  productType: ProductType;

  initialProduct?: Product;
  value?: number;
  onChange?: (value: number) => void;

  excludeProductId?: number;

  className?: string;
  ref?: unknown;
}

export const ProductAutocomplete: FunctionComponent<
  ProductAutocompleteProps
> = (props) => {
  const {
    value,
    initialProduct,
    productType: type,
    onChange: triggerOnChange,
    excludeProductId,
    className,
    ...restProps
  } = props;

  const [product, setProduct] = useState(initialProduct ?? null);
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProduct() {
      if (product != null && value !== 0) {
        return;
      }

      const result = await productService.get(value);
      setProduct(result);
    }

    if (value != null && value !== 0) {
      fetchProduct();
    }
  }, [product, value]);

  const onQuery = useCallback(
    async (query: string) => {
      const results = await productService.autocompleteProduct(query, type);
      const filtered = results.filter(
        (product) => product != null && product.id !== excludeProductId,
      );

      setResults(filtered);

      return filtered.length > 0;
    },
    [type, excludeProductId, setResults],
  );

  const onChange = useCallback(
    async (value: string) => {
      if (!value) {
        triggerOnChange(null);
      }

      const productId = Number(value);
      triggerOnChange(productId);
    },
    [triggerOnChange],
  );

  return (
    <Autocomplete
      label={product?.name ?? ''}
      value={value != null && value !== 0 ? `${value}` : ''}
      onQuery={onQuery}
      onChange={onChange}
      className={className}
      {...restProps}
    >
      {results.map((result) => (
        <ProductAutocompleteOption
          key={result.id}
          product={result}
          label={result.name}
          value={`${result.id}`}
          className="hover:bg-[#fafafa]"
          hoveredClassName="bg-[#fafafa]"
        />
      ))}
    </Autocomplete>
  );
};

interface ProductAutocompleteOptionProps extends AutocompleteOptionProps {
  product: Product;
}

const ProductAutocompleteOption: FunctionComponent<
  ProductAutocompleteOptionProps
> = (props) => {
  const { product } = props;

  return <div>{product.name}</div>;
};
