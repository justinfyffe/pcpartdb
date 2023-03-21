import { Gpu, GpuField } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { formatGpuField, getGpuName } from '../../../../../gpus';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '../../../../../shared/components';
import { BooleanFormatter } from '../../../../../shared/format';

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

  // Benchmarks
  g3dMark: 'G3D Mark',
  g2dMark: 'G2D Mark',
  timespyGraphics: '3DMark Time Spy Graphics',
};

interface FormattedDataTabProps {
  gpu: Gpu;
}

export const FormattedDataTab: FunctionComponent<FormattedDataTabProps> = (
  props,
) => {
  const { gpu } = props;

  return (
    <div className="bg-white flex flex-col overflow-auto">
      <Table>
        <THead>
          <Tr sticky>
            <Th className="w-[50%]">Field</Th>
            <Th className="w-[50%]">Value</Th>
          </Tr>
        </THead>
        <TBody>
          <FormattedDataRow label="Name" value={getGpuName(gpu)} />
          <FormattedDataRow label="Slug" value={gpu.slug} />
          <FormattedDataRow field={gpu.company} />
          <FormattedDataRow field={gpu.marketSegment} />
          <FormattedDataRow field={gpu.launchPrice} />
          <FormattedDataRow field={gpu.releaseDate} />

          <FormattedDataRow field={gpu.specs?.codename} />
          <FormattedDataRow field={gpu.specs?.architecture} />
          <FormattedDataRow field={gpu.specs?.processSize} />
          <FormattedDataRow field={gpu.specs?.transistors} />

          <FormattedDataRow field={gpu.specs?.memorySize} />
          <FormattedDataRow field={gpu.specs?.memoryType} />
          <FormattedDataRow field={gpu.specs?.memoryClock} />
          <FormattedDataRow field={gpu.specs?.memoryInterface} />
          <FormattedDataRow field={gpu.specs?.memoryBandwidth} />

          <FormattedDataRow field={gpu.specs?.slotWidth} />
          <FormattedDataRow field={gpu.specs?.length} />
          <FormattedDataRow field={gpu.specs?.width} />
          <FormattedDataRow field={gpu.specs?.height} />
          <FormattedDataRow field={gpu.specs?.weight} />
          <FormattedDataRow field={gpu.specs?.thermalDesignPower} />
          <FormattedDataRow field={gpu.specs?.suggestedPsu} />
          <FormattedDataRow field={gpu.specs?.busInterface} />
          <FormattedDataRow field={gpu.specs?.powerConnectors} />
          <FormattedDataRow field={gpu.specs?.outputs} />

          <FormattedDataRow field={gpu.specs?.shaderUnitsCudaCores} />
          <FormattedDataRow field={gpu.specs?.computeUnitsSmCount} />
          <FormattedDataRow field={gpu.specs?.textureMappingUnits} />
          <FormattedDataRow field={gpu.specs?.renderOutputUnits} />
          <FormattedDataRow field={gpu.specs?.tensorCores} />
          <FormattedDataRow field={gpu.specs?.rayTracingCores} />
          <FormattedDataRow field={gpu.specs?.coreClockSpeedBase} />
          <FormattedDataRow field={gpu.specs?.coreClockSpeedBoost} />
          <FormattedDataRow field={gpu.specs?.l1Cache} />
          <FormattedDataRow field={gpu.specs?.l2Cache} />

          <FormattedDataRow field={gpu.specs?.pixelFillRate} />
          <FormattedDataRow field={gpu.specs?.textureFillRate} />
          <FormattedDataRow field={gpu.specs?.fp32Performance} />
          <FormattedDataRow field={gpu.specs?.fp64Performance} />

          <FormattedDataRow field={gpu.specs?.directxVersion} />
          <FormattedDataRow field={gpu.specs?.openClVersion} />
          <FormattedDataRow field={gpu.specs?.openGlVersion} />
          <FormattedDataRow field={gpu.specs?.shaderModelVersion} />

          <FormattedDataRow field={gpu.benchmarks?.g3dMark} />
          <FormattedDataRow field={gpu.benchmarks?.g2dMark} />
          <FormattedDataRow field={gpu.benchmarks?.timespyGraphics} />
        </TBody>
      </Table>
    </div>
  );
};

interface FormattedDataRowProps {
  label?: string;
  value?: string;
  field?: GpuField;
}

const FormattedDataRow: FunctionComponent<FormattedDataRowProps> = (props) => {
  const { label, value, field } = props;

  if (field != null) {
    return (
      <Tr>
        <Td>{LABELS[field.meta?.fieldKey]}</Td>
        <Td>
          {formatGpuField(field, {
            booleanFormatter: BooleanFormatter.YesNo,
          }) || '--'}
        </Td>
      </Tr>
    );
  }

  if (label != null) {
    return (
      <Tr>
        <Td>{label}</Td>
        <Td>{value || '--'}</Td>
      </Tr>
    );
  }

  return <></>;
};
