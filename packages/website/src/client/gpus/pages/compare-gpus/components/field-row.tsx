import { formatGpuField } from '@pcpartdb/website/client/gpus';
import { Td, Tr } from '@pcpartdb/website/client/shared/components';
import { BooleanFormatter } from '@pcpartdb/website/client/shared/format';
import {
  Gpu,
  GpuBenchmarks,
  GpuField,
  GpuSpecs,
} from '@pcpartdb/website/shared/gpus';
import React, { useContext } from 'react';
import { ComparePageContext } from '../context';

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
  let field1: GpuField;
  let field2: GpuField;
  if (key in gpu1.specs || key in gpu2.specs) {
    field1 = gpu1.specs[key as keyof GpuSpecs] as GpuField;
    field2 = gpu2.specs[key as keyof GpuSpecs] as GpuField;
  } else if (key in gpu1.benchmarks || key in gpu2.benchmarks) {
    field1 = gpu1.benchmarks[key as keyof GpuBenchmarks] as GpuField;
    field2 = gpu2.benchmarks[key as keyof GpuBenchmarks] as GpuField;
  } else {
    field1 = gpu1[key as keyof Gpu] as GpuField;
    field2 = gpu2[key as keyof Gpu] as GpuField;
  }

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
