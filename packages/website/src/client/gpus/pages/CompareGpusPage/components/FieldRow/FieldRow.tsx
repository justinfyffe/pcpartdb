import { Gpu, GpuField } from '@pcpartdb/shared';
import React, { useContext } from 'react';
import { Td, Tr } from '../../../../../shared/components';
import { BooleanFormatter } from '../../../../../shared/format';
import { formatGpuField } from '../../../..';
import { ComparePageContext } from '../../context';

const LABELS: Record<string, string> = {
  // General
  partNumber: 'Part Number',
  company: 'Manufacturer',
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
  computeUnitsSmCount: 'Compute Units / SM Count',
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

interface FieldRowProps {
  field: string;
}

export const FieldRow = (props: FieldRowProps) => {
  const { field: key } = props;

  const context = useContext(ComparePageContext);
  const [gpu1, gpu2] = context.comparison;
  const field1 = gpu1[key as keyof Gpu] as GpuField;
  const field2 = gpu2[key as keyof Gpu] as GpuField;

  return (
    <Tr>
      <Td className="text-left w-[33%]">{LABELS[key]}</Td>
      <Td className="text-left w-[33%]">
        {formatGpuField(field1, {
          booleanFormatter: BooleanFormatter.YesNo,
        }) || '--'}
      </Td>
      <Td className="text-left w-[33%]">
        {formatGpuField(field2, {
          booleanFormatter: BooleanFormatter.YesNo,
        }) || '--'}
      </Td>
    </Tr>
  );
};
