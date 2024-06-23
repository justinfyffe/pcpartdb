'use client';

import {
  BenchmarkKey,
  ProductType,
  UpdateUserSettingsRequest,
  UserSettings,
} from '@pcpartdb/shared';
import React, { useCallback } from 'react';
import { closeDialog, showDialog } from '../../components/Dialog/dialog';
import { useUserSettings } from '../../contexts/UserSettingsProvider';
import { updateUserSettings } from '../../user/api';
import { PreferredBenchmarkDialog } from '../components/PreferredBenchmark/PreferredBenchmarkDialog';

interface UsePreferredBenchmarkDialogOptions {
  productType: ProductType;

  softReload?: boolean;
  hardReload?: boolean;

  productIds?: number[];
  gameSlug?: string;

  onChange?: (benchmark: BenchmarkKey) => void;
}

export const usePreferredBenchmarkDialog = (
  options: UsePreferredBenchmarkDialogOptions,
) => {
  const { productType, hardReload, softReload, onChange } = options;

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

      const updateSettingsRequest: UpdateUserSettingsRequest = {
        settings: newSettings,
      };
      await updateUserSettings(updateSettingsRequest);

      const url = getNewUrl(productType, benchmark);
      if (hardReload) {
        window.location.href = url;
      } else if (softReload) {
        if (!window.location.href.includes('#')) {
          window.history.replaceState({}, '', url);
        }

        setUserSettings(newSettings);
        onChange?.(benchmark);
        closeDialog();
      } else {
        throw new Error(
          'Missing hardReload or softReload for preferred benchmarks dialog',
        );
      }
    },
    [
      userSettings,
      productType,
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
        onSelection={handleSelection}
      />,
    );
  }, [handleSelection, productType]);
};

function getNewUrl(productType: ProductType, benchmark: BenchmarkKey) {
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
