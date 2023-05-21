import { GpuDiff, GpuField } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { formatGpuField } from '../../../../gpus';
import { Table, TBody, Td, Th, THead, Tr } from '../../../../shared/components';
import { BooleanFormatter } from '../../../../shared/format';

const LABELS: Record<string, string> = {
  // General
  partNumber: 'Part Number',
  company: 'Manufacturer',
  marketSegment: 'Market Segment',
  launchPrice: 'Launch Price (MSRP)',
  releaseDate: 'Release Date',
  productionStatus: 'Production Status',

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

interface FormattedDiffTabProps {
  diff: GpuDiff;
}

export const FormattedDiffTab: FunctionComponent<FormattedDiffTabProps> = (
  props,
) => {
  const { diff } = props;

  const before = diff.original;
  const after = diff.updated;

  return (
    <div className="bg-white flex flex-col overflow-auto">
      <Table responsive border>
        <THead>
          <Tr sticky>
            <Th className="w-[30%] font-bold">Field</Th>
            <Th className="w-[35%] font-bold">Before</Th>
            <Th className="w-[35%] font-bold">After</Th>
          </Tr>
        </THead>
        <TBody>
          <FormattedDiffRow
            label="Name"
            beforeValue={before?.name}
            afterValue={after.name}
          />
          <FormattedDiffRow
            label="Slug"
            beforeValue={before?.slug}
            afterValue={after.slug}
          />
          <FormattedDiffRow
            before={before?.partNumber}
            after={after.partNumber}
          />
          <FormattedDiffRow before={before?.company} after={after.company} />
          <FormattedDiffRow
            before={before?.marketSegment}
            after={after.marketSegment}
          />
          <FormattedDiffRow
            before={before?.launchPrice}
            after={after.launchPrice}
          />
          <FormattedDiffRow
            before={before?.releaseDate}
            after={after.releaseDate}
          />
          <FormattedDiffRow
            before={before?.productionStatus}
            after={after.productionStatus}
          />

          <FormattedDiffRow before={before?.codename} after={after.codename} />
          <FormattedDiffRow
            before={before?.architecture}
            after={after.architecture}
          />
          <FormattedDiffRow
            before={before?.processSize}
            after={after.processSize}
          />
          <FormattedDiffRow
            before={before?.transistors}
            after={after.transistors}
          />

          <FormattedDiffRow
            before={before?.memorySize}
            after={after.memorySize}
          />
          <FormattedDiffRow
            before={before?.memoryType}
            after={after.memoryType}
          />
          <FormattedDiffRow
            before={before?.memoryClock}
            after={after.memoryClock}
          />
          <FormattedDiffRow
            before={before?.memoryInterface}
            after={after.memoryInterface}
          />
          <FormattedDiffRow
            before={before?.memoryBandwidth}
            after={after.memoryBandwidth}
          />

          <FormattedDiffRow
            before={before?.slotWidth}
            after={after.slotWidth}
          />
          <FormattedDiffRow before={before?.length} after={after.length} />
          <FormattedDiffRow before={before?.width} after={after.width} />
          <FormattedDiffRow before={before?.height} after={after.height} />
          <FormattedDiffRow before={before?.weight} after={after.weight} />
          <FormattedDiffRow
            before={before?.thermalDesignPower}
            after={after.thermalDesignPower}
          />
          <FormattedDiffRow
            before={before?.suggestedPsu}
            after={after.suggestedPsu}
          />
          <FormattedDiffRow
            before={before?.busInterface}
            after={after.busInterface}
          />
          <FormattedDiffRow
            before={before?.powerConnectors}
            after={after.powerConnectors}
          />
          <FormattedDiffRow before={before?.outputs} after={after.outputs} />

          <FormattedDiffRow
            before={before?.shaderUnitsCudaCores}
            after={after.shaderUnitsCudaCores}
          />
          <FormattedDiffRow
            before={before?.computeUnitsSmCount}
            after={after.computeUnitsSmCount}
          />
          <FormattedDiffRow
            before={before?.textureMappingUnits}
            after={after.textureMappingUnits}
          />
          <FormattedDiffRow
            before={before?.renderOutputUnits}
            after={after.renderOutputUnits}
          />
          <FormattedDiffRow
            before={before?.tensorCores}
            after={after.tensorCores}
          />
          <FormattedDiffRow
            before={before?.rayTracingCores}
            after={after.rayTracingCores}
          />
          <FormattedDiffRow
            before={before?.coreClockSpeedBase}
            after={after.coreClockSpeedBase}
          />
          <FormattedDiffRow
            before={before?.coreClockSpeedBoost}
            after={after.coreClockSpeedBoost}
          />
          <FormattedDiffRow before={before?.l1Cache} after={after.l1Cache} />
          <FormattedDiffRow before={before?.l2Cache} after={after.l2Cache} />

          <FormattedDiffRow
            before={before?.pixelFillRate}
            after={after.pixelFillRate}
          />
          <FormattedDiffRow
            before={before?.textureFillRate}
            after={after.textureFillRate}
          />
          <FormattedDiffRow
            before={before?.fp32Performance}
            after={after.fp32Performance}
          />
          <FormattedDiffRow
            before={before?.fp64Performance}
            after={after.fp64Performance}
          />

          <FormattedDiffRow
            before={before?.directxVersion}
            after={after.directxVersion}
          />
          <FormattedDiffRow
            before={before?.openClVersion}
            after={after.openClVersion}
          />
          <FormattedDiffRow
            before={before?.openGlVersion}
            after={after.openGlVersion}
          />
          <FormattedDiffRow
            before={before?.shaderModelVersion}
            after={after.shaderModelVersion}
          />

          <FormattedDiffRow before={before?.g3dMark} after={after.g3dMark} />
          <FormattedDiffRow before={before?.g2dMark} after={after.g2dMark} />
          <FormattedDiffRow
            before={before?.timespyGraphics}
            after={after.timespyGraphics}
          />
        </TBody>
      </Table>
    </div>
  );
};

interface FormattedDiffRowProps {
  label?: string;
  beforeValue?: string;
  afterValue?: string;
  before?: GpuField;
  after?: GpuField;
}

const FormattedDiffRow: FunctionComponent<FormattedDiffRowProps> = (props) => {
  const { label, beforeValue, afterValue, before, after } = props;

  let hasChange = false;
  if (before != null && after != null) {
    hasChange = before.value !== after.value;
  } else if (beforeValue != null && afterValue != null) {
    hasChange = beforeValue !== afterValue;
  }

  if (after != null) {
    return (
      <Tr>
        <Td className={hasChange ? 'bg-yellow-100' : ''}>
          {LABELS[after.meta?.fieldKey]}
        </Td>
        <Td className={hasChange ? 'bg-yellow-100' : ''}>
          {formatGpuField(before, {
            booleanFormatter: BooleanFormatter.YesNo,
          }) || '--'}
        </Td>
        <Td className={hasChange ? 'bg-yellow-100' : ''}>
          {formatGpuField(after, {
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
        <Td>{beforeValue || '--'}</Td>
        <Td>{afterValue || '--'}</Td>
      </Tr>
    );
  }

  return <></>;
};
