'use client';

import {
  BenchmarkKey,
  getPreferenceBenchmarks,
  getProductBenchmarkName,
  ProductType,
  UpdateUserSettingsRequest,
  UserSettings,
} from '@pcpartdb/shared';
import React, { useCallback, useState } from 'react';
import { Button } from '../../../components/Button/Button';
import { GenericButton } from '../../../components/Button/GenericButton';
import { ButtonVariant } from '../../../components/Button/types';
import { Dialog, DialogProps } from '../../../components/Dialog/Dialog';
import { useUserSettings } from '../../../contexts/UserSettingsProvider';
import { updateUserSettings } from '../../../user/api';
import { classNames } from '../../../utils/classNames';

interface PreferredBenchmarkDialogProps extends DialogProps {
  productType: ProductType;
  onSelection: (benchmark: BenchmarkKey) => void;
}

export function PreferredBenchmarkDialog(props: PreferredBenchmarkDialogProps) {
  const { productType, onSelection, ...dialogProps } = props;

  const preferredBenchmarkOptions = getPreferenceBenchmarks(productType);
  const [selecting, setSelecting] = useState<BenchmarkKey>(null);

  const handleSelection = useCallback(
    async (benchmark: BenchmarkKey) => {
      try {
        setSelecting(benchmark);
        await onSelection(benchmark);
      } finally {
        setSelecting(null);
      }
    },
    [onSelection],
  );

  return (
    <Dialog showClose={true} {...dialogProps}>
      <div className="flex flex-col gap-2">
        {preferredBenchmarkOptions.map((benchmark) => (
          <GenericButton
            key={benchmark}
            disabled={selecting != null && benchmark !== selecting}
            onClick={() => handleSelection(benchmark)}
            className={classNames(
              selecting === benchmark ? 'animate-pulse bg-loading' : '',
            )}
          >
            {getProductBenchmarkName(benchmark)}
          </GenericButton>
        ))}
      </div>
    </Dialog>
  );
}

interface PreferredBenchmarkDialogTriggerProps
  extends Omit<PreferredBenchmarkDialogProps, 'onSelection'> {
  softReload?: boolean;
  hardReload?: boolean;
  productIds?: number[];
  gameSlug?: string;
  onChange?: (benchmark: BenchmarkKey) => void;

  buttonVariant?: ButtonVariant;
  className?: string;
  children?: React.ReactNode;
}

export function PreferredBenchmarkDialogTrigger(
  props: PreferredBenchmarkDialogTriggerProps,
) {
  const { productType, hardReload, softReload, onChange } = props;

  const [dialogVisible, setDialogVisible] = useState(false);
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

        setDialogVisible(false);
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

  return (
    <>
      <Button
        variant={props.buttonVariant ?? ButtonVariant.None}
        onClick={() => setDialogVisible(true)}
        className={props.className}
      >
        {props.children}
      </Button>

      <PreferredBenchmarkDialog
        productType={productType}
        onSelection={handleSelection}
        visible={dialogVisible}
        title="Choose your preferred benchmark"
        showClose
        onClose={() => setDialogVisible(false)}
      />
    </>
  );
}

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
