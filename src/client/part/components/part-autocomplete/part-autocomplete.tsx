import { getCompanyLogoImagePath } from '@client/image';
import { usePartCache } from '@client/shared/cache';
import { Autocomplete, Img } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Part, PartType } from '@shared/part';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { partService } from '../../part-service';
import { PartAutocompleteOption } from './part-autocomplete-option';

interface PartAutocompleteProps {
  partType: PartType;

  value?: number;
  onChange?: (value: number) => void;

  excludePartId?: number;

  className?: string;
}

export const PartAutocomplete = forwardRef<
  HTMLInputElement,
  PartAutocompleteProps
>((props, ref) => {
  const { value, partType: type, onChange, excludePartId, className } = props;

  const inputRef = useRef<HTMLInputElement>();
  useImperativeHandle(ref, () => inputRef.current);

  const partCache = usePartCache();

  const [results, setResults] = useState<Part[]>([]);
  const [part, setPart] = useState(() => {
    if (value == null) {
      return null;
    }

    return partCache.get(value);
  });

  useEffect(() => {
    async function fetchPart() {
      if (part != null && value != null) {
        return;
      }

      const result = partCache.get(value);
      setPart(result);
    }

    if (value != null) {
      fetchPart();
    }
  }, [partCache, part, value]);

  const handleQuery = useCallback(
    async (query: string) => {
      const results = await partService.autocompletePart(query, type);
      const filtered = results.filter(
        (part) => part != null && part.id !== excludePartId,
      );

      setResults(filtered);
      return filtered.length > 0;
    },
    [type, excludePartId, setResults],
  );

  const handleChange = useCallback(
    async (value: string) => {
      if (value == null) {
        setPart(null);
        onChange?.(null);
        return;
      }

      const partId = Number(value);
      const selectedPart = partCache.get(partId);
      setPart(selectedPart);
      onChange?.(partId);
    },
    [partCache, onChange],
  );

  const handleSuffixClick = useCallback(() => {
    inputRef.current.focus();
  }, [inputRef]);

  const prefixImage = getCompanyLogoImagePath(part);

  return (
    <Autocomplete
      prefix={
        prefixImage ? <Img src={prefixImage} className="h-5" /> : undefined
      }
      label={part?.name ?? ''}
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
        <PartAutocompleteOption key={result.id} index={i} part={result} />
      ))}
    </Autocomplete>
  );
});
PartAutocomplete.displayName = 'PartAutocomplete';
