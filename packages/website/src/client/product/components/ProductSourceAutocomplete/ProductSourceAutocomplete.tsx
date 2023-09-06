import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { ProductSource, ProductSourceKey, ProductType } from '@pcpartdb/shared';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Autocomplete } from '../../../shared/components/Autocomplete/Autocomplete';
import { classNames } from '../../../shared/ui/classNames';
import { productSourceService } from '../../services/productSourceService';
import { ProductSourceAutocompleteOption } from './ProductSourceAutocompleteOption';

interface ProductSourceAutocompleteProps {
  productType: ProductType;
  source?: ProductSourceKey;

  value?: ProductSource;
  onChange?: (value: ProductSource) => void;

  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const ProductSourceAutocomplete = forwardRef<
  HTMLInputElement,
  ProductSourceAutocompleteProps
>((props, ref) => {
  const {
    productType,
    source,
    value,
    onChange,
    disabled,
    placeholder: propsPlaceholder,
    className,
  } = props;

  const inputRef = useRef<HTMLInputElement>();
  useImperativeHandle(ref, () => inputRef.current);

  const [results, setResults] = useState<ProductSource[]>([]);

  const label = value?.sourceName;
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
        source,
        query,
      });
      const filtered = response.sources.filter((source) => source != null);

      setResults(filtered);
      return filtered.length > 0;
    },
    [productType, source],
  );

  const handleChange = useCallback(
    async (value: ProductSource) => {
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
      disabled={disabled}
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
