import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Gpu } from '@pcpartdb/shared';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getCompanyLogoAutocompletePath } from '../../../image';
import { useGpuCache } from '../../../shared/cache';
import { Autocomplete, Img } from '../../../shared/components';
import { classNames } from '../../../shared/ui';
import { gpuService } from '../../gpuService';
import { getGpuName } from '../../utils';
import { GpuAutocompleteOption } from './GpuAutocompleteOption';

interface GpuAutocompleteProps {
  value?: number;
  onChange?: (value: number) => void;
  onChangeGpu?: (value: Gpu) => void;

  excludeGpuId?: number;

  className?: string;
}

export const GpuAutocomplete = forwardRef<
  HTMLInputElement,
  GpuAutocompleteProps
>((props, ref) => {
  const { value, onChange, onChangeGpu, excludeGpuId, className } = props;

  const inputRef = useRef<HTMLInputElement>();
  useImperativeHandle(ref, () => inputRef.current);

  const gpuCache = useGpuCache();

  const [results, setResults] = useState<Gpu[]>([]);
  const [gpu, setGpu] = useState(() => {
    if (value == null) {
      return null;
    }

    return gpuCache.get(value);
  });

  const label = useMemo(() => getGpuName(gpu, { company: false }), [gpu]);
  const prefixImage = useMemo(() => getCompanyLogoAutocompletePath(gpu), [gpu]);

  useEffect(() => {
    async function fetchGpu() {
      if (gpu != null && value != null) {
        return;
      }

      const result = gpuCache.get(value);
      setGpu(result);
    }

    if (value != null) {
      fetchGpu();
    }
  }, [gpuCache, gpu, value]);

  const handleQuery = useCallback(
    async (query: string) => {
      const results = await gpuService.autocomplete(query);
      const filtered = results.filter(
        (gpu) => gpu != null && gpu.id !== excludeGpuId,
      );

      setResults(filtered);
      return filtered.length > 0;
    },
    [excludeGpuId, setResults],
  );

  const handleChange = useCallback(
    async (value: string) => {
      if (value == null) {
        setGpu(null);
        onChange?.(null);
        return;
      }

      const gpuId = Number(value);
      const selectedGpu = gpuCache.get(gpuId);
      setGpu(selectedGpu);
      onChange?.(gpuId);
      onChangeGpu?.(selectedGpu);

      // Need to delay, otherwise it seems like forms sometimes re-focuses.
      setTimeout(() => {
        inputRef?.current?.blur();
      });
    },
    [gpuCache, onChange, onChangeGpu],
  );

  const handleSuffixClick = useCallback(() => {
    inputRef.current.focus();
  }, [inputRef]);

  return (
    <Autocomplete
      prefix={
        prefixImage ? <Img src={prefixImage} className="h-5" /> : undefined
      }
      label={label || ''}
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
        <GpuAutocompleteOption key={result.id} index={i} gpu={result} />
      ))}
    </Autocomplete>
  );
});
GpuAutocomplete.displayName = 'GpuAutocomplete';
