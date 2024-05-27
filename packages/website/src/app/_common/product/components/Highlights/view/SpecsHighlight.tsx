import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import {
  chunkify,
  Product,
  productFieldFormattedValue,
  ProductType,
} from '@pcpartdb/shared';
import React from 'react';
import { HighlightCard } from '../../../../components/Card/HighlightCard';

enum SpecType {
  CpuClock,
  CpuCoreThreads,
  CpuMemory,

  GpuMemory,
  GpuSlots,
  GpuTdp,

  ReleaseDate,
}

const SPECS_TO_SHOW: Partial<Record<ProductType, SpecType[]>> = {
  [ProductType.Cpu]: [
    SpecType.CpuCoreThreads,
    SpecType.CpuMemory,
    SpecType.CpuClock,
    SpecType.ReleaseDate,
  ],
  [ProductType.Gpu]: [
    SpecType.GpuMemory,
    SpecType.GpuSlots,
    SpecType.GpuTdp,
    SpecType.ReleaseDate,
  ],
};

interface SpecsHighlightProps {
  product: Product;
  className?: string;
}

export function SpecsHighlight(props: SpecsHighlightProps) {
  const { product, className } = props;

  const specsToShow = SPECS_TO_SHOW[product.productType];
  const specChunks = chunkify(specsToShow, { totalChunks: 2 });

  return (
    <HighlightCard
      icon={<ClipboardDocumentListIcon />}
      leftTitle="Specs at a glance"
      className={className}
    >
      <div className="flex flex-wrap gap-y-2 gap-x-4 whitespace-nowrap">
        {specChunks.map((chunk, i) => (
          <div key={i} className="flex flex-1 flex-col gap-2">
            {chunk.map((specType) => (
              <div
                key={specType}
                className="flex flex-row gap-4 justify-between border-b-px border-dotted border-b-primary"
              >
                <span className="font-medium">{getSpecLabel(specType)}</span>
                <span>{getSpecValue(specType, product) || '--'}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </HighlightCard>
  );
}

function getSpecLabel(type: SpecType) {
  if (type === SpecType.CpuClock) {
    return 'Clock';
  } else if (type === SpecType.CpuCoreThreads) {
    return 'Cores / Threads';
  } else if (type === SpecType.CpuMemory) {
    return 'Memory Support';
  } else if (type === SpecType.GpuMemory) {
    return 'Memory';
  } else if (type === SpecType.GpuSlots) {
    return 'Slots';
  } else if (type === SpecType.GpuTdp) {
    return 'TDP';
  } else if (type === SpecType.ReleaseDate) {
    return 'Release Date';
  }

  throw new Error(`Invalid spec type for getSpecLabel: ${type}`);
}

function getSpecValue(type: SpecType, product: Product) {
  // CPU-Specific
  if (type === SpecType.CpuClock) {
    const clock = productFieldFormattedValue(product.fields?.clock) || null;
    const turboClock =
      productFieldFormattedValue(product.fields?.turboClock) || null;
    if (clock == null && turboClock == null) {
      return null;
    }

    return `${clock || '--'} / ${turboClock || '--'}`;
  } else if (type === SpecType.CpuCoreThreads) {
    const cores = productFieldFormattedValue(product.fields?.cores) || null;
    const threads = productFieldFormattedValue(product.fields?.threads) || null;
    if (cores == null && threads == null) {
      return null;
    }

    return `${cores || '--'} / ${threads || '--'}`;
  } else if (type === SpecType.CpuMemory) {
    return productFieldFormattedValue(product.fields?.memorySupport) || null;
  }

  // GPU-Specific
  if (type === SpecType.GpuMemory) {
    const memoryValues = new Set([
      productFieldFormattedValue(product.fields?.memorySize),
      productFieldFormattedValue(product.fields?.memoryType),
    ]);

    return (
      [...memoryValues.values()]
        .filter(
          (value) => value != null && value.toLowerCase() !== 'system shared',
        )
        .join(' ') || null
    );
  } else if (type === SpecType.GpuSlots) {
    return productFieldFormattedValue(product.fields?.slotWidth) || null;
  } else if (type === SpecType.GpuTdp) {
    return productFieldFormattedValue(product.fields?.tdp) || null;
  }

  // Common
  if (type === SpecType.ReleaseDate) {
    return productFieldFormattedValue(product.fields?.releaseDate) || null;
  }

  return null;
}
