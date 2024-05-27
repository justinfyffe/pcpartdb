'use client';

import { getProductBenchmarkName, Product } from '@pcpartdb/shared';
import React, { useMemo } from 'react';
import { Button } from '../../../components/Button/Button';
import { ButtonVariant } from '../../../components/Button/types';
import { useGameSelection } from '../../../game/contexts/GameSelectionProvider';
import { usePreferredBenchmark } from '../../hooks/usePreferredBenchmark';
import { usePreferredBenchmarkDialog } from '../../hooks/usePreferredBenchmarkDialog';

interface PreferredBenchmarkButtonProps {
  products: Partial<Product>[];
  softReload?: boolean;
}

export function PreferredBenchmarkButton(props: PreferredBenchmarkButtonProps) {
  const { products } = props;
  const productType = useMemo(
    () => products.find((p) => p.productType)?.productType,
    [products],
  );
  const productIds = useMemo(() => products.map((p) => p.id), [products]);

  const preferredBenchmark = usePreferredBenchmark(productType);
  const { selectedGame } = useGameSelection();

  const showPreferredBenchmarkDialog = usePreferredBenchmarkDialog({
    productType,
    softReload: props.softReload,
    productIds,
    gameSlug: selectedGame?.slug,
  });

  return (
    <Button
      variant={ButtonVariant.Link}
      className="inline-block hover:underline"
      onClick={showPreferredBenchmarkDialog}
    >
      {getProductBenchmarkName(preferredBenchmark)}
    </Button>
  );
}
