import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { Product, ProductType } from '../../../types/product';
import {
  Autocomplete,
  AutocompleteOption,
} from '../../shared/components/autocomplete';
import { productService } from '../product.service';

export const ProductAutocomplete = forwardRef<
  HTMLInputElement,
  ProductAutocompleteProps
>((props, ref) => {
  const {
    value,
    initialProduct,
    productType: type,
    onChange,
    excludeProductId,
    className,
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

  const handleQuery = useCallback(
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

  const handleChange = useCallback(
    async (value: string) => {
      if (value == null) {
        onChange?.(null);
        return;
      }

      onChange?.(Number(value));
    },
    [onChange],
  );

  return (
    <Autocomplete
      label={product?.name ?? ''}
      value={value != null && value !== 0 ? `${value}` : ''}
      onQuery={handleQuery}
      onChange={handleChange}
      className={className}
      ref={ref}
    >
      {results.map((result) => (
        <AutocompleteOption
          key={result.id}
          label={result.name}
          value={`${result.id}`}
          className="hover:bg-[#fafafa]"
          hoveredClassName="bg-[#fafafa]"
        >
          {result.name}
        </AutocompleteOption>
      ))}
    </Autocomplete>
  );
});
ProductAutocomplete.displayName = 'ProductAutocomplete';

interface ProductAutocompleteProps {
  productType: ProductType;

  initialProduct?: Product;
  value?: number;
  onChange?: (value: number) => void;

  excludeProductId?: number;

  className?: string;
}
