import { ProductCache } from '@client/shared/cache';
import {
  Autocomplete,
  AutocompleteOption,
  Img,
} from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Product, ProductType } from '@shared/product';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { productService } from '../../product-service';

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

  const [results, setResults] = useState<Product[]>([]);
  const [product, setProduct] = useState(() => {
    if (value == null) {
      return null;
    }

    return ProductCache.get(value);
  });

  useEffect(() => {
    async function fetchProduct() {
      if (product != null && value != null) {
        return;
      }

      const result =
        ProductCache.get(value) || (await productService.get(value));
      setProduct(result);
    }

    if (value != null) {
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
        setProduct(null);
        onChange?.(null);
        return;
      }

      const productId = Number(value);
      const selectedProduct =
        ProductCache.get(productId) || (await productService.get(productId));
      setProduct(selectedProduct);
      onChange?.(productId);
    },
    [onChange],
  );

  const prefixImage = useMemo(() => {
    if (product == null) {
      return null;
    }

    const specs = product.specs;

    if (specs.company?.value === 'NVIDIA') {
      return '/images/logos/nvidia.svg';
    } else if (specs.company?.value === 'AMD') {
      return '/images/logos/amd.svg';
    } else {
      return null;
    }
  }, [product]);

  const resultsImages = useMemo(() => {
    if (results.length === 0) {
      return null;
    }

    return results.map((product) => {
      const specs = product.specs;

      if (specs.company?.value === 'NVIDIA') {
        return '/images/logos/nvidia.svg';
      } else if (specs.company?.value === 'AMD') {
        return '/images/logos/amd.svg';
      } else {
        return null;
      }
    });
  }, [results]);

  return (
    <Autocomplete
      prefix={prefixImage ? <Img src={prefixImage} className="h-5" /> : <></>}
      label={product?.name ?? ''}
      value={value != null && value !== 0 ? `${value}` : ''}
      onQuery={handleQuery}
      onChange={handleChange}
      className={classNames('flex flex-1 items-center', className)}
      suffix={value == null ? <ChevronDownIcon className="w-4" /> : null}
      ref={ref}
    >
      {results.map((result, i) => (
        <AutocompleteOption
          key={result.id}
          label={result.name}
          value={`${result.id}`}
          className="hover:bg-[#fafafa]"
          hoveredClassName="bg-[#fafafa]"
        >
          <div className="flex flex-1 items-center gap-4">
            {resultsImages[i] ? (
              <Img src={resultsImages[i]} className="h-5" />
            ) : (
              <></>
            )}
            <span className="flex-1">{result.name}</span>
            <div className="flex flex-col gap-1 items-end text-2xs">
              <div className="text-[#aaa]">2022</div>
              <div className="text-[#aaa]">$399.99</div>
            </div>
          </div>
        </AutocompleteOption>
      ))}
    </Autocomplete>
  );
});
ProductAutocomplete.displayName = 'ProductAutocomplete';
