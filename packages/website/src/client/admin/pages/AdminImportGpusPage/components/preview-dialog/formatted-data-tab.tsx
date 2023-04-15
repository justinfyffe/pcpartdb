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

          <FormattedDataRow field={gpu.codename} />
          <FormattedDataRow field={gpu.architecture} />
          <FormattedDataRow field={gpu.processSize} />
          <FormattedDataRow field={gpu.transistors} />

          <FormattedDataRow field={gpu.memorySize} />
          <FormattedDataRow field={gpu.memoryType} />
          <FormattedDataRow field={gpu.memoryClock} />
          <FormattedDataRow field={gpu.memoryInterface} />
          <FormattedDataRow field={gpu.memoryBandwidth} />

          <FormattedDataRow field={gpu.slotWidth} />
          <FormattedDataRow field={gpu.length} />
          <FormattedDataRow field={gpu.width} />
          <FormattedDataRow field={gpu.height} />
          <FormattedDataRow field={gpu.weight} />
          <FormattedDataRow field={gpu.thermalDesignPower} />
          <FormattedDataRow field={gpu.suggestedPsu} />
          <FormattedDataRow field={gpu.busInterface} />
          <FormattedDataRow field={gpu.powerConnectors} />
          <FormattedDataRow field={gpu.outputs} />

          <FormattedDataRow field={gpu.shaderUnitsCudaCores} />
          <FormattedDataRow field={gpu.computeUnitsSmCount} />
          <FormattedDataRow field={gpu.textureMappingUnits} />
          <FormattedDataRow field={gpu.renderOutputUnits} />
          <FormattedDataRow field={gpu.tensorCores} />
          <FormattedDataRow field={gpu.rayTracingCores} />
          <FormattedDataRow field={gpu.coreClockSpeedBase} />
          <FormattedDataRow field={gpu.coreClockSpeedBoost} />
          <FormattedDataRow field={gpu.l1Cache} />
          <FormattedDataRow field={gpu.l2Cache} />

          <FormattedDataRow field={gpu.pixelFillRate} />
          <FormattedDataRow field={gpu.textureFillRate} />
          <FormattedDataRow field={gpu.fp32Performance} />
          <FormattedDataRow field={gpu.fp64Performance} />

          <FormattedDataRow field={gpu.directxVersion} />
          <FormattedDataRow field={gpu.openClVersion} />
          <FormattedDataRow field={gpu.openGlVersion} />
          <FormattedDataRow field={gpu.shaderModelVersion} />

          <FormattedDataRow field={gpu.g3dMark} />
          <FormattedDataRow field={gpu.g2dMark} />
          <FormattedDataRow field={gpu.timespyGraphics} />
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
