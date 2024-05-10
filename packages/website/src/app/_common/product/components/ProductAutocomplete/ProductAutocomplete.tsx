'use client';

import { ChevronDownIcon } from '@heroicons/react/24/outline';
import {
  formatCompanyName,
  formatProductName,
  Product,
  ProductType,
} from '@pcpartdb/shared';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useProductCache } from '../../../cache/ProductCache';
import { Autocomplete } from '../../../components/Autocomplete/Autocomplete';
import { Img } from '../../../components/Img/Img';
import { classNames } from '../../../utils/classNames';
import { companyLogoAutocompletePath } from '../../../utils/companyLogoAutocompletePath';
import { autocompleteProducts } from '../../api';
import { ProductAutocompleteOption } from './ProductAutocompleteOption';

interface ProductAutocompleteProps {
  productType: ProductType;
  value?: number;
  onChange?: (value: number) => void;
  onChangeProduct?: (value: Partial<Product>) => void;

  excludeProductId?: number;

  placeholder?: string;
  clearable?: boolean;
  className?: string;
}

export const ProductAutocomplete = forwardRef<
  HTMLInputElement,
  ProductAutocompleteProps
>((props, ref) => {
  const {
    productType,
    value,
    onChange,
    onChangeProduct,
    excludeProductId,
    placeholder: propsPlaceholder,
    className,
  } = props;

  const inputRef = useRef<HTMLInputElement>();
  useImperativeHandle(ref, () => inputRef.current!);

  const productCache = useProductCache();

  const [results, setResults] = useState<Partial<Product>[]>([]);
  const [product, setProduct] = useState(() => {
    if (value == null) {
      return null;
    }

    return productCache.get(productType, value);
  });

  const label = useMemo(
    () => formatProductName(product, { company: false }),
    [product],
  );
  const prefixImage = useMemo(
    () => companyLogoAutocompletePath(product),
    [product],
  );
  const company = useMemo(
    () => formatCompanyName(product?.company),
    [product?.company],
  );
  const placeHolder = useMemo(() => {
    if (propsPlaceholder != null) {
      return propsPlaceholder;
    }

    if (productType === ProductType.Cpu) {
      return 'Select CPU';
    } else if (productType === ProductType.Gpu) {
      return 'Select GPU';
    } else {
      return 'Select Product';
    }
  }, [propsPlaceholder, productType]);

  useEffect(() => {
    async function fetchProduct() {
      if (product != null && value != null) {
        return;
      }

      const result = productCache.get(productType, value!);
      setProduct(result);
    }

    if (value != null) {
      fetchProduct();
    }
  }, [value, product, productCache, productType]);

  const handleQuery = useCallback(
    async (query: string) => {
      const results = await autocompleteProducts(productType, query || '');
      const filtered = results.filter(
        (product) => product != null && product.id !== excludeProductId,
      );

      setResults(filtered);
      return filtered.length > 0;
    },
    [excludeProductId, productType],
  );

  const handleChange = useCallback(
    async (value: unknown) => {
      if (value == null) {
        setProduct(null);
        onChange?.(null);
        return;
      }

      const productId = Number(value);
      const selectedProduct = productCache.get(productType, productId);
      setProduct(selectedProduct);
      onChange?.(productId);
      onChangeProduct?.(selectedProduct);

      // Need to delay, otherwise it seems like forms sometimes re-focuses.
      setTimeout(() => {
        inputRef?.current?.blur();
      });
    },
    [onChange, onChangeProduct, productCache, productType],
  );

  return (
    <Autocomplete
      prefix={
        prefixImage ? (
          <Img
            loading="lazy"
            src={prefixImage}
            alt={company || undefined}
            className="h-5"
          />
        ) : undefined
      }
      label={label || ''}
      value={value != null && value !== 0 ? `${value}` : ''}
      onQuery={handleQuery}
      onChange={handleChange}
      className={classNames('flex flex-1 items-center', className)}
      suffix={value == null ? <ChevronDownIcon className="w-4" /> : null}
      placeholder={placeHolder}
      ref={inputRef as any}
    >
      {results.map((result, i) => (
        <ProductAutocompleteOption key={result.id} index={i} product={result} />
      ))}
    </Autocomplete>
  );
});
ProductAutocomplete.displayName = 'ProductAutocomplete';
