import { Td, Tr } from '@client/shared/components';
import {
  formatProductSpec,
  ProductSpecBooleanFormatter,
  ProductSpecKey,
} from '@shared/product-spec';
import React, { useContext } from 'react';
import { ProductContext } from '../product-context';

const LABELS: Record<string, string> = {
  [ProductSpecKey.Architecture]: 'Architecture',
  [ProductSpecKey.BusInterface]: 'Bus Interface',
  [ProductSpecKey.CoreClockSpeedBase]: 'Clock Speed (Base)',
  [ProductSpecKey.CoreClockSpeedBoost]: 'Clock Speed (Boost)',
  [ProductSpecKey.Company]: 'Company',
  [ProductSpecKey.ShaderUnitsCudaCores]: 'Shader Units / CUDA Cores',
  [ProductSpecKey.DirectXVersion]: 'DirectX',
  [ProductSpecKey.Fp32Performance]: 'FP32 Performance',
  [ProductSpecKey.Fp64Performance]: 'FP64 Performance',
  [ProductSpecKey.GpuName]: 'GPU Name',
  [ProductSpecKey.GSyncFreeSyncSupport]: 'G-Sync / FreeSync',
  [ProductSpecKey.Height]: 'Height',
  [ProductSpecKey.L1Cache]: 'L1 Cache',
  [ProductSpecKey.L2Cache]: 'L2 Cache',
  [ProductSpecKey.LaunchPriceMsrp]: 'Launch Price (MSRP)',
  [ProductSpecKey.Length]: 'Length',
  [ProductSpecKey.ProcessSize]: 'Process Size',
  [ProductSpecKey.MarketSegment]: 'Market Segment',
  [ProductSpecKey.MemoryClock]: 'Memory Clock',
  [ProductSpecKey.MemoryBandwidth]: 'Memory Bandwidth',
  [ProductSpecKey.MemoryInterface]: 'Memory Interface',
  [ProductSpecKey.MemorySize]: 'Memory Size',
  [ProductSpecKey.MemoryType]: 'Memory Type',
  [ProductSpecKey.OpenClVersion]: 'OpenCL',
  [ProductSpecKey.OpenGlVersion]: 'OpenGL',
  [ProductSpecKey.Outputs]: 'Outputs',
  [ProductSpecKey.PixelFillRate]: 'Pixel Fill Rate',
  [ProductSpecKey.PowerConnectors]: 'Power Connectors',
  [ProductSpecKey.ReleaseDate]: 'Release Date',
  [ProductSpecKey.RenderOutputUnits]: 'Render Output Units (ROPs)',
  [ProductSpecKey.RayTracingCores]: 'Ray Tracing Cores (RT Cores)',
  [ProductSpecKey.ShaderModelVersion]: 'Shader Model',
  [ProductSpecKey.SliCrossfireSupport]: 'SLI / Crossfire',
  [ProductSpecKey.SlotWidth]: 'Slot Width',
  [ProductSpecKey.SuggestedPsu]: 'Suggested PSU',
  [ProductSpecKey.Tdp]: 'Thermal Design Power (TDP)',
  [ProductSpecKey.TensorCores]: 'Tensor Cores',
  [ProductSpecKey.TextureFillRate]: 'Texture Fill Rate',
  [ProductSpecKey.TextureMappingUnits]: 'Texture Mapping Units (TMUs)',
  [ProductSpecKey.Transistors]: 'Transistors',
  [ProductSpecKey.Weight]: 'Weight',
  [ProductSpecKey.Width]: 'Width',
};

interface SpecRowProps {
  spec: ProductSpecKey;
}

export const SpecRow = (props: SpecRowProps) => {
  const { spec: key } = props;

  const context = useContext(ProductContext);
  const spec = context.specs[key];

  return (
    <Tr>
      <Td className="border-r-0 text-left">{LABELS[key]}</Td>
      <Td className="border-l-0 text-right">
        {formatProductSpec(spec, {
          booleanFormatter: ProductSpecBooleanFormatter.YesNo,
        })}
      </Td>
    </Tr>
  );
};
