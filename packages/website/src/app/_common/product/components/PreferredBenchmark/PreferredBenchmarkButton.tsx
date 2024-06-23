'use client';

import {
  BenchmarkKey,
  getProductBenchmarkName,
  Product,
  ProductType,
} from '@pcpartdb/shared';
import React, { useMemo } from 'react';
import { Button } from '../../../components/Button/Button';
import { ButtonVariant } from '../../../components/Button/types';
import { useGameSelection } from '../../../game/contexts/GameSelectionProvider';
import { usePreferredBenchmark } from '../../hooks/usePreferredBenchmark';
import { usePreferredBenchmarkDialog } from '../../hooks/usePreferredBenchmarkDialog';

interface PreferredBenchmarkButtonProps {
  productType?: ProductType;
  products?: Partial<Product>[];

  hardReload?: boolean;
  softReload?: boolean;

  onChange?: (benchmark: BenchmarkKey) => void;
}

export function PreferredBenchmarkButton(props: PreferredBenchmarkButtonProps) {
  const { products, onChange } = props;
  const productType = useMemo(
    () => props.productType ?? products.find((p) => p.productType)?.productType,
    [props.productType, products],
  );
  const productIds = useMemo(() => products?.map((p) => p.id), [products]);

  const preferredBenchmark = usePreferredBenchmark(productType);
  const { selectedGame } = useGameSelection();

  const showPreferredBenchmarkDialog = usePreferredBenchmarkDialog({
    productType,
    hardReload: props.hardReload,
    softReload: props.softReload,
    productIds,
    gameSlug: selectedGame?.slug,
    onChange,
  });

  return (
    <Button
      variant={ButtonVariant.Link}
      className="inline-block underline decoration-dotted decoration-1"
      onClick={showPreferredBenchmarkDialog}
    >
      {getProductBenchmarkName(preferredBenchmark)}
    </Button>
  );
}
