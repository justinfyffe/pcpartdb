'use client';

import { CurrencyDollarIcon, StarIcon } from '@heroicons/react/24/outline';
import { ProductType } from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import React, { useMemo } from 'react';
import { ListType, usePageContext } from '../../PageProvider';

interface ProductListToggleProps {
  productType: ProductType;
}

export function ProductListToggle(props: ProductListToggleProps) {
  const { productType } = props;
  const context = usePageContext();

  const [listType, setListType] = useMemo(() => {
    if (productType === ProductType.Cpu) {
      return [context.cpuListType, context.setCpuListType];
    } else if (productType === ProductType.Gpu) {
      return [context.gpuListType, context.setGpuListType];
    }
    return [null, null];
  }, [
    context.cpuListType,
    context.gpuListType,
    context.setCpuListType,
    context.setGpuListType,
    productType,
  ]);

  return (
    <div className="flex xs:flex-col items-center border-px rounded">
      <Button
        variant={ButtonVariant.None}
        className={classNames(
          'border-r-px xs:border-r-0 xs:border-b-px',
          listType === ListType.Performance ? 'bg-disabled' : '',
        )}
        disabled={listType === ListType.Performance}
        onClick={() => setListType(ListType.Performance)}
      >
        <StarIcon className="w-5" />
      </Button>

      <Button
        variant={ButtonVariant.None}
        className={classNames(
          listType === ListType.PerformancePerMsrp ? 'bg-disabled' : '',
        )}
        disabled={listType === ListType.PerformancePerMsrp}
        onClick={() => setListType(ListType.PerformancePerMsrp)}
      >
        <CurrencyDollarIcon className="w-5" />
      </Button>
    </div>
  );
}
