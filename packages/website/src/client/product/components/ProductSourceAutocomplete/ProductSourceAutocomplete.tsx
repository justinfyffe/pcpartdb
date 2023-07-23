import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { ProductSource, ProductType } from '@pcpartdb/shared';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Autocomplete } from '../../../shared/components';
import { classNames } from '../../../shared/ui';
import { productSourceService } from '../../services';
import { ProductSourceAutocompleteOption } from './ProductSourceAutocompleteOption';

interface ProductSourceAutocompleteProps {
  productType: ProductType;

  value?: ProductSource;
  onChange?: (value: ProductSource) => void;

  placeholder?: string;
  className?: string;
}

export const ProductSourceAutocomplete = forwardRef<
  HTMLInputElement,
  ProductSourceAutocompleteProps
>((props, ref) => {
  const {
    productType,
    value,
    onChange,
    placeholder: propsPlaceholder,
    className,
  } = props;

  const inputRef = useRef<HTMLInputElement>();
  useImperativeHandle(ref, () => inputRef.current);

  const [results, setResults] = useState<ProductSource[]>([]);
  const [productSource, setProductSource] = useState<ProductSource>(value);

  const label = productSource?.sourceName;
  const placeHolder = useMemo(() => {
    if (propsPlaceholder != null) {
      return propsPlaceholder;
    }

    return 'Search sources';
  }, [propsPlaceholder]);

  const handleQuery = useCallback(
    async (query: string) => {
      const response = await productSourceService.autocomplete({
        productType,
        query,
      });
      const filtered = response.sources.filter((source) => source != null);

      setResults(filtered);
      return filtered.length > 0;
    },
    [productType],
  );

  const handleChange = useCallback(
    async (value: ProductSource) => {
      setProductSource(value);
      onChange?.(value);

      // Need to delay, otherwise it seems like forms sometimes re-focuses.
      setTimeout(() => {
        inputRef?.current?.blur();
      });
    },
    [onChange],
  );

  const handleSuffixClick = useCallback(() => {
    inputRef.current.focus();
  }, [inputRef]);

  return (
    <Autocomplete
      label={label || ''}
      value={value}
      onQuery={handleQuery}
      onChange={handleChange}
      onSuffixClick={handleSuffixClick}
      className={classNames('flex flex-1 items-center', className)}
      suffix={value == null ? <ChevronDownIcon className="w-4" /> : null}
      placeholder={placeHolder}
      ref={inputRef}
    >
      {results.map((result, i) => (
        <ProductSourceAutocompleteOption
          key={result.id}
          index={i}
          source={result}
        />
      ))}
    </Autocomplete>
  );
});
ProductSourceAutocomplete.displayName = 'ProductSourceAutocomplete';
