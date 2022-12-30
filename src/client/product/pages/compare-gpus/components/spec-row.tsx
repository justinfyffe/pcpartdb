import { formatSpec } from '@client/product';
import { Td, Tr } from '@client/shared/components';
import { BooleanFormatter } from '@client/shared/format';
import { SpecKey } from '@shared/spec';
import React, { useContext } from 'react';
import { ComparePageContext } from '../context';

const LABELS: Record<string, string> = {
  // General
  company: 'Company',
  marketSegment: 'Market Segment',
  launchPrice: 'Launch Price (MSRP)',
  releaseDate: 'Release Date',

  // Processor
  gpuName: 'GPU Name',
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
  directXVersion: 'DirectX',
  openClVersion: 'OpenCL',
  openGlVersion: 'OpenGL',
  shaderModelVersion: 'Shader Model',
};

interface SpecRowProps {
  spec: SpecKey;
}

export const SpecRow = (props: SpecRowProps) => {
  const { spec: key } = props;

  const context = useContext(ComparePageContext);
  const [product1, product2] = context.comparison;
  const spec1 = product1.specs[key];
  const spec2 = product2.specs[key];

  return (
    <Tr>
      <Td className="text-left w-[33%]">{LABELS[key]}</Td>
      <Td className="text-left w-[33%]">
        {formatSpec(spec1, {
          booleanFormatter: BooleanFormatter.YesNo,
        }) || '--'}
      </Td>
      <Td className="text-left w-[33%]">
        {formatSpec(spec2, {
          booleanFormatter: BooleanFormatter.YesNo,
        }) || '--'}
      </Td>
    </Tr>
  );
};
