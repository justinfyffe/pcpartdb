import {
  BenchmarkKey,
  ProductType,
  UpdateUserSettingsRequest,
  UserSettings,
} from '@pcpartdb/shared';
import React, { useCallback } from 'react';
import { closeDialog, showDialog } from '../components/Dialog/dialog';
import { useUserSettings } from '../contexts/UserSettingsProvider';
import { updateUserSettings } from './api';
import { PreferredBenchmarkDialog } from './components/PreferredBenchmarkDialog/PreferredBenchmarkDialog';
import { usePreferredBenchmark } from './usePreferredBenchmark';

interface UsePreferredBenchmarkDialogOptions {
  productType: ProductType;

  softReload?: boolean;
  hardReload?: boolean;

  productIds?: number[];

  onChange?: (viewModel: any) => void;
}

export const usePreferredBenchmarkDialog = (
  options: UsePreferredBenchmarkDialogOptions,
) => {
  const { productType, productIds, hardReload, softReload, onChange } = options;

  const preferredBenchmark = usePreferredBenchmark(productType);
  const { userSettings, setUserSettings } = useUserSettings();

  const handleSelection = useCallback(
    async (benchmark: BenchmarkKey) => {
      const newSettings: UserSettings = {
        ...userSettings,
        preferredBenchmarks: {
          ...(userSettings?.preferredBenchmarks ?? {}),
          [productType]: benchmark,
        },
      };
      const request: UpdateUserSettingsRequest = {
        settings: newSettings,
        productType,
        productIds,
      };

      const response = await updateUserSettings(request);

      if (hardReload) {
        window.location.href = getBenchmarkUrl(productType, benchmark);
      } else if (softReload) {
        setUserSettings(newSettings);
        onChange?.(response);
        closeDialog();
      } else {
        throw new Error('Missing handler for preferred benchmarks dialog');
      }
    },
    [
      userSettings,
      productType,
      productIds,
      hardReload,
      softReload,
      setUserSettings,
      onChange,
    ],
  );

  return useCallback(() => {
    showDialog(
      <PreferredBenchmarkDialog
        productType={productType}
        selected={preferredBenchmark}
        onSelection={handleSelection}
      />,
    );
  }, [handleSelection, preferredBenchmark, productType]);
};

function getBenchmarkUrl(productType: ProductType, benchmark: BenchmarkKey) {
  const benchmarkLc = benchmark.toLowerCase();
  const url = new URL(window.location.href);

  // Add benchmark to url
  if (productType === ProductType.Cpu) {
    url.searchParams.set('cpu_benchmark', benchmarkLc);
  } else if (productType === ProductType.Gpu) {
    url.searchParams.set('gpu_benchmark', benchmarkLc);
  }

  // Remove pagination stuff (for list page)
  if (url.searchParams.has('offset')) {
    url.searchParams.delete('offset');
  }

  return url.toString();
}
