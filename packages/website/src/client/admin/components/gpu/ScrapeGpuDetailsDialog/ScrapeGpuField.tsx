import { GpuField, GpuFieldKey } from '@pcpartdb/shared';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { formatGpuField } from '../../../../gpus';
import { Checkbox, Td, Tr } from '../../../../shared/components';
import { BooleanFormatter } from '../../../../shared/format';
import { ScrapeGpuDetailsContext } from './ScrapeGpuDetailsContext';

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

interface ScrapeGpuFieldProps {
  field: GpuFieldKey;
}

export const ScrapeGpuField: FunctionComponent<ScrapeGpuFieldProps> = (
  props,
) => {
  const { field: key } = props;

  const context = useContext(ScrapeGpuDetailsContext);
  const fields = context.fields;
  const emptyValue: GpuField = useMemo(
    () => ({
      value: null,
      meta: { fieldKey: key, autoUpdate: false },
    }),
    [key],
  );

  const [checked, setChecked] = useState(() => false);

  useEffect(() => {
    if (fields[key] == null) {
      fields[key] = { value: emptyValue, enabled: false };
      setChecked(false);
    } else {
      setChecked(fields[key].enabled);
    }
  }, [fields, key, emptyValue]);

  const handleClick = useCallback(() => {
    if (checked) {
      fields[key].enabled = false;
      fields[key].value.meta.autoUpdate = false;
    } else {
      fields[key].enabled = true;
      fields[key].value.meta.autoUpdate = true;
    }

    setChecked(!checked);
  }, [checked, fields, key]);

  return (
    <Tr onClick={handleClick} className="hover:bg-gray-200 cursor-pointer">
      <Td>{LABELS[key]}</Td>
      <Td>
        {formatGpuField(fields?.[key]?.value, {
          booleanFormatter: BooleanFormatter.YesNo,
        }) || '--'}
      </Td>
      <Td className="text-right">
        <Checkbox value={fields?.[key]?.enabled ?? false} />
      </Td>
    </Tr>
  );
};
