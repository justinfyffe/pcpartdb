import { formatSpec } from '@client/part';
import { Checkbox, Td, Tr } from '@client/shared/components';
import { BooleanFormatter } from '@client/shared/format';
import { SpecKey } from '@shared/spec';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useState,
} from 'react';
import { ImportPartDataContext } from './import-part-data-context';

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

interface ImportSpecProps {
  spec: SpecKey;
}

export const ImportSpec: FunctionComponent<ImportSpecProps> = (props) => {
  const { spec: key } = props;

  const context = useContext(ImportPartDataContext);
  const specs = context.specs;

  const [spec] = useState(() => {
    if (specs?.[key] == null || specs?.[key]?.value == null) {
      delete specs?.[key];
      return null;
    }
    return specs[key];
  });
  const [checked, setChecked] = useState(() => spec != null);

  const handleClick = useCallback(() => {
    if (checked) {
      delete specs[key];
    } else {
      specs[key] = spec;
    }

    setChecked(!checked);
  }, [specs, key, spec, checked]);

  return (
    <Tr onClick={handleClick} className="hover:bg-gray-200 cursor-pointer">
      <Td>{LABELS[key]}</Td>
      <Td>
        {formatSpec(spec, {
          booleanFormatter: BooleanFormatter.YesNo,
        }) || '--'}
      </Td>
      <Td className="text-right">
        <Checkbox value={checked} />
      </Td>
    </Tr>
  );
};
