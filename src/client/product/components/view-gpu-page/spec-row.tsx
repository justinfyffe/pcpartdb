import { Td, Tr } from '@client/shared/components';
import { formatSpec, SpecBooleanFormatter, SpecKey } from '@shared/spec';
import React, { useContext } from 'react';
import { ProductContext } from '../product-context';

const LABELS: Record<string, string> = {
  [SpecKey.Architecture]: 'Architecture',
  [SpecKey.BusInterface]: 'Bus Interface',
  [SpecKey.CoreClockSpeedBase]: 'Clock Speed (Base)',
  [SpecKey.CoreClockSpeedBoost]: 'Clock Speed (Boost)',
  [SpecKey.Company]: 'Company',
  [SpecKey.ShaderUnitsCudaCores]: 'Shader Units / CUDA Cores',
  [SpecKey.DirectXVersion]: 'DirectX',
  [SpecKey.Fp32Performance]: 'FP32 Performance',
  [SpecKey.Fp64Performance]: 'FP64 Performance',
  [SpecKey.GpuName]: 'GPU Name',
  [SpecKey.GSyncFreeSyncSupport]: 'G-Sync / FreeSync',
  [SpecKey.Height]: 'Height',
  [SpecKey.L1Cache]: 'L1 Cache',
  [SpecKey.L2Cache]: 'L2 Cache',
  [SpecKey.LaunchPriceMsrp]: 'Launch Price (MSRP)',
  [SpecKey.Length]: 'Length',
  [SpecKey.ProcessSize]: 'Process Size',
  [SpecKey.MarketSegment]: 'Market Segment',
  [SpecKey.MemoryClock]: 'Memory Clock',
  [SpecKey.MemoryBandwidth]: 'Memory Bandwidth',
  [SpecKey.MemoryInterface]: 'Memory Interface',
  [SpecKey.MemorySize]: 'Memory Size',
  [SpecKey.MemoryType]: 'Memory Type',
  [SpecKey.OpenClVersion]: 'OpenCL',
  [SpecKey.OpenGlVersion]: 'OpenGL',
  [SpecKey.Outputs]: 'Outputs',
  [SpecKey.PixelFillRate]: 'Pixel Fill Rate',
  [SpecKey.PowerConnectors]: 'Power Connectors',
  [SpecKey.ReleaseDate]: 'Release Date',
  [SpecKey.RenderOutputUnits]: 'Render Output Units (ROPs)',
  [SpecKey.RayTracingCores]: 'Ray Tracing Cores (RT Cores)',
  [SpecKey.ShaderModelVersion]: 'Shader Model',
  [SpecKey.SliCrossfireSupport]: 'SLI / Crossfire',
  [SpecKey.SlotWidth]: 'Slot Width',
  [SpecKey.SuggestedPsu]: 'Suggested PSU',
  [SpecKey.ThermalDesignPower]: 'Thermal Design Power (TDP)',
  [SpecKey.TensorCores]: 'Tensor Cores',
  [SpecKey.TextureFillRate]: 'Texture Fill Rate',
  [SpecKey.TextureMappingUnits]: 'Texture Mapping Units (TMUs)',
  [SpecKey.Transistors]: 'Transistors',
  [SpecKey.Weight]: 'Weight',
  [SpecKey.Width]: 'Width',
};

interface SpecRowProps {
  spec: SpecKey;
}

export const SpecRow = (props: SpecRowProps) => {
  const { spec: key } = props;

  const context = useContext(ProductContext);
  const spec = context.specs[key];

  return (
    <Tr>
      <Td className="border-r-0 text-left">{LABELS[key]}</Td>
      <Td className="border-l-0 text-right">
        {formatSpec(spec, {
          booleanFormatter: SpecBooleanFormatter.YesNo,
        })}
      </Td>
    </Tr>
  );
};
