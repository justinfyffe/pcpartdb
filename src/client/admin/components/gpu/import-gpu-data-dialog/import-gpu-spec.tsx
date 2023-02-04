import { formatGpuSpec } from '@client/gpus';
import { Checkbox, Td, Tr } from '@client/shared/components';
import { BooleanFormatter } from '@client/shared/format';
import { GpuSpec, GpuSpecKey } from '@shared/gpus';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ImportGpuDataContext } from './import-gpu-data-context';

const LABELS: Record<string, string> = {
  // General
  company: 'Company',
  marketSegment: 'Market Segment',
  launchPrice: 'Launch Price (MSRP)',
  releaseDate: 'Release Date',

  // Processor
  codename: 'GPU Codename',
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

interface ImportGpuSpecProps {
  spec: GpuSpecKey;
}

export const ImportGpuSpec: FunctionComponent<ImportGpuSpecProps> = (props) => {
  const { spec: key } = props;

  const context = useContext(ImportGpuDataContext);
  const specs = context.specs;
  const emptyValue: GpuSpec = useMemo(
    () => ({ value: null, meta: { specKey: key } }),
    [key],
  );

  const [checked, setChecked] = useState(() => false);

  useEffect(() => {
    if (specs[key] == null) {
      specs[key] = { value: emptyValue, import: false };
      setChecked(false);
    } else {
      setChecked(specs[key].import);
    }
  }, [specs, key, emptyValue]);

  const handleClick = useCallback(() => {
    if (checked) {
      specs[key].import = false;
    } else {
      specs[key].import = true;
    }

    setChecked(!checked);
  }, [specs, key, checked]);

  return (
    <Tr onClick={handleClick} className="hover:bg-gray-200 cursor-pointer">
      <Td>{LABELS[key]}</Td>
      <Td>
        {formatGpuSpec(specs?.[key]?.value, {
          booleanFormatter: BooleanFormatter.YesNo,
        }) || '--'}
      </Td>
      <Td className="text-right">
        <Checkbox value={specs?.[key]?.import ?? false} />
      </Td>
    </Tr>
  );
};
