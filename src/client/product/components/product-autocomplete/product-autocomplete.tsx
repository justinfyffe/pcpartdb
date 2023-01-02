import { getCompanyLogoImagePath } from '@client/image';
import { useProductCache } from '@client/shared/cache';
import { Autocomplete, Img } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Product, ProductType } from '@shared/product';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { productService } from '../../product-service';
import { ProductAutocompleteOption } from './product-autocomplete-option';

interface ProductAutocompleteProps {
  productType: ProductType;

  value?: number;
  onChange?: (value: number) => void;

  excludeProductId?: number;

  className?: string;
}

export const ProductAutocomplete = forwardRef<
  HTMLInputElement,
  ProductAutocompleteProps
>((props, ref) => {
  const {
    value,
    productType: type,
    onChange,
    excludeProductId,
    className,
  } = props;

  const inputRef = useRef<HTMLInputElement>();
  useImperativeHandle(ref, () => inputRef.current);

  const productCache = useProductCache();

  const [results, setResults] = useState<Product[]>([]);
  const [product, setProduct] = useState(() => {
    if (value == null) {
      return null;
    }

    return productCache.get(value);
  });

  useEffect(() => {
    async function fetchProduct() {
      if (product != null && value != null) {
        return;
      }

      const result = productCache.get(value);
      setProduct(result);
    }

    if (value != null) {
      fetchProduct();
    }
  }, [productCache, product, value]);

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
        setProduct(null);
        onChange?.(null);
        return;
      }

      const productId = Number(value);
      const selectedProduct = productCache.get(productId);
      setProduct(selectedProduct);
      onChange?.(productId);
    },
    [productCache, onChange],
  );

  const handleSuffixClick = useCallback(() => {
    inputRef.current.focus();
  }, [inputRef]);

  const prefixImage = getCompanyLogoImagePath(product);

  return (
    <Autocomplete
      prefix={
        prefixImage ? <Img src={prefixImage} className="h-5" /> : undefined
      }
      label={product?.name ?? ''}
      value={value != null && value !== 0 ? `${value}` : ''}
      onQuery={handleQuery}
      onChange={handleChange}
      onSuffixClick={handleSuffixClick}
      className={classNames('flex flex-1 items-center', className)}
      suffix={value == null ? <ChevronDownIcon className="w-4" /> : null}
      placeholder="Select GPU"
      ref={inputRef}
    >
      {results.map((result, i) => (
        <ProductAutocompleteOption key={result.id} index={i} product={result} />
      ))}
    </Autocomplete>
  );
});
ProductAutocomplete.displayName = 'ProductAutocomplete';
