import { formatGpuSpec } from '@client/gpus/gpu-spec-utils';
import { Td, Tr } from '@client/shared/components';
import { BooleanFormatter } from '@client/shared/format';
import { GpuSpec, GpuSpecKey } from '@shared/gpus';
import React, { useContext } from 'react';
import { ViewPageContext } from '../context';

const LABELS: Record<string, string> = {
  // General
  company: 'Company',
  marketSegment: 'Market Segment',
  launchPrice: 'Launch Price (MSRP)',
  releaseDate: 'Release Date',

  // Processor
  codename: 'Codename',
  architecture: 'Architecture',
  processSize: 'Process Size',
  transistors: 'Transistors',

  // Memory
  memorySize: 'Memory Size',
  memoryType: 'Memory Type',
  memoryClock: 'Memory Clock',
  memoryInterface: 'Memory Interface',
  memoryBandwidth: 'Memory Bandwidth',

  // Board Design
  slotWidth: 'Slots',
  length: 'Length',
  width: 'Width',
  height: 'Height',
  weight: 'Weight',
  thermalDesignPower: 'Thermal Design Power (TDP)',
  suggestedPsu: 'Suggested PSU',
  busInterface: 'Bus Interface',
  powerConnectors: 'Power Connectors',
  outputs: 'Outputs',

  // Cores & Clock Speeds
  shaderUnitsCudaCores: 'Shader Units / CUDA Cores',
  textureMappingUnits: 'Texture Mapping Units (TMUs)',
  renderOutputUnits: 'Render Output Units (ROPs)',
  tensorCores: 'Tensor Cores',
  rayTracingCores: 'Ray Tracing Cores',
  coreClockSpeedBase: 'Clock Speed (Base)',
  coreClockSpeedBoost: 'Clock Speed (Boost)',
  l1Cache: 'L1 Cache',
  l2Cache: 'L2 Cache',

  // Theoretical Performance
  pixelFillRate: 'Pixel Fill Rate',
  textureFillRate: 'Texture Fill Rate',
  fp32Performance: 'FP32 Performance',
  fp64Performance: 'FP64 Performance',

  // API Support
  directxVersion: 'DirectX',
  openClVersion: 'OpenCL',
  openGlVersion: 'OpenGL',
  shaderModelVersion: 'Shader Model',
};

interface SpecRowProps {
  spec: GpuSpecKey;
}

export const SpecRow = (props: SpecRowProps) => {
  const { spec: key } = props;

  const { gpu } = useContext(ViewPageContext);
  const specs = gpu.specs;

  return (
    <Tr>
      <Td className="text-left w-[50%]">{LABELS[key]}</Td>
      <Td className="text-left w-[50%]">
        {formatGpuSpec(specs[key] as GpuSpec, {
          booleanFormatter: BooleanFormatter.YesNo,
        }) || '--'}
      </Td>
    </Tr>
  );
};
