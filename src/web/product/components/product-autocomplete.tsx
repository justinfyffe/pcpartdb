import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Product, ProductType } from '../../../types/product';
import {
  Autocomplete,
  AutocompleteItem,
} from '../../shared/components/autocomplete';
import { productService } from '../product.service';

interface ProductAutocompleteProps {
  productType: ProductType;

  value?: number;
  onChange?: (value: number) => void;
  onProduct?: (product: Product) => void;

  excludeProductId?: number;

  className?: string;
  ref?: unknown;
}

export const ProductAutocomplete: FunctionComponent<
  ProductAutocompleteProps
> = (props) => {
  const {
    productType: type,
    onChange: triggerOnChange,
    onProduct: triggerOnProduct,
    value,
    excludeProductId,
    className,
    ...restProps
  } = props;

  const [product, setProduct] = useState(null);
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProduct() {
      const result = await productService.get(value);
      setProduct(result);
      triggerOnProduct?.(result);
    }

    if (value != null && value != 0) {
      fetchProduct();
    }
  }, [value, triggerOnProduct]);

  const onQuery = useCallback(
    async (query: string) => {
      const results = await productService.autocompleteProduct(query, type);

      setResults(
        results.filter(
          (product) => product != null && product.id !== excludeProductId,
        ),
      );
    },
    [type, excludeProductId, setResults],
  );

  const onChange = useCallback(
    (value: string) => {
      triggerOnChange(value ? Number(value) : Number(0));
    },
    [triggerOnChange],
  );

  return (
    <Autocomplete
      label={product?.name ?? ''}
      value={value != null && value != 0 ? `${value}` : ''}
      onQuery={onQuery}
      onChange={onChange}
      className={className}
      {...restProps}
    >
      {results.map((result, i) => (
        <ProductAutocompleteItem key={result.id} index={i} product={result} />
      ))}
    </Autocomplete>
  );
};

interface ProductAutocompleteItemProps {
  index: number;
  product: Product;
}

const ProductAutocompleteItem: FunctionComponent<
  ProductAutocompleteItemProps
> = (props) => {
  const { index, product } = props;

  return (
    <AutocompleteItem
      index={index}
      className="hover:bg-[#fafafa]"
      hoveredClassName="bg-[#fafafa]"
      value={product}
    >
      {product.name}
    </AutocompleteItem>
  );
};
